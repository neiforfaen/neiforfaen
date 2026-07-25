import { strict as assert } from "node:assert"

const { ACCESS_TOKEN } = process.env

if (!ACCESS_TOKEN) {
  throw new Error("Missing ACCESS_TOKEN environment variable.")
}

const USERNAME = "neiforfaen"
// GraphQL node id for USERNAME (databaseId 180103988)
const OWNER_ID = "U_kgDOCrwrNA"
const HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  authorization: `token ${ACCESS_TOKEN}`,
}

const call = async (
  fnName: string,
  query: string,
  vars: Record<string, unknown>
): Promise<Response> => {
  // Returns a request or throws an Error if response fails.
  const request = await fetch("https://api.github.com/graphql", {
    body: JSON.stringify({
      query,
      variables: vars,
    }),
    headers: HEADERS,
    method: "POST",
  })

  if (request.status === 200) {
    return request
  }

  throw new Error(`${fnName} failed with a ${request.status} error.`)
}

const followerCount = async (): Promise<number> => {
  const query = `
  query($login: String!) {
    user(login: $login) {
      followers {
        totalCount
      }
    }
  }`
  const res = await call("followerCount", query, { login: USERNAME })
  const { data } = (await res.json()) as {
    data: { user: { followers: { totalCount: number } } }
  }
  return data.user.followers.totalCount
}

const ownedRepoStats = async (): Promise<{
  repoCount: number
  starCount: number
}> => {
  const query = `
  query($login: String!) {
    user(login: $login) {
      repositories(first: 100, ownerAffiliations: [OWNER]) {
        totalCount
        edges {
          node {
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  }`
  const res = await call("ownedRepoStats", query, { login: USERNAME })
  const { data } = (await res.json()) as {
    data: {
      user: {
        repositories: {
          totalCount: number
          edges: { node: { stargazers: { totalCount: number } } }[]
        }
      }
    }
  }
  const { totalCount, edges } = data.user.repositories
  const starCount = edges.reduce(
    (sum, e) => sum + e.node.stargazers.totalCount,
    0
  )
  return { repoCount: totalCount, starCount }
}

interface RepoEdge {
  node: {
    nameWithOwner: string
    defaultBranchRef: { target: { history: { totalCount: number } } } | null
  }
}

const contributedRepos = async (): Promise<RepoEdge[]> => {
  const query = `
  query($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(
        first: 60
        after: $cursor
        ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]
      ) {
        edges {
          node {
            nameWithOwner
            defaultBranchRef {
              target {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }`
  const edges: RepoEdge[] = []
  let cursor: string | null = null
  for (;;) {
    // Sequential by nature: each page's cursor depends on the previous response.
    // eslint-disable-next-line no-await-in-loop
    const res = await call("contributedRepos", query, {
      cursor,
      login: USERNAME,
    })
    // eslint-disable-next-line no-await-in-loop
    const { data } = (await res.json()) as {
      data: {
        user: {
          repositories: {
            edges: RepoEdge[]
            pageInfo: { endCursor: string | null; hasNextPage: boolean }
          }
        }
      }
    }
    edges.push(...data.user.repositories.edges)
    if (!data.user.repositories.pageInfo.hasNextPage) {
      return edges
    }
    cursor = data.user.repositories.pageInfo.endCursor
  }
}

interface RepoLoc {
  additions: number
  deletions: number
  myCommits: number
}

const repoLoc = async (owner: string, repoName: string): Promise<RepoLoc> => {
  const query = `
  query($owner: String!, $repoName: String!, $cursor: String) {
    repository(owner: $owner, name: $repoName) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, after: $cursor) {
              edges {
                node {
                  ... on Commit {
                    additions
                    deletions
                    author {
                      user {
                        id
                      }
                    }
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      }
    }
  }`
  let additions = 0
  let deletions = 0
  let myCommits = 0
  let cursor: string | null = null
  for (;;) {
    // Sequential by nature: each page's cursor depends on the previous response.
    // eslint-disable-next-line no-await-in-loop
    const res = await call("repoLoc", query, { cursor, owner, repoName })
    // eslint-disable-next-line no-await-in-loop
    const { data } = (await res.json()) as {
      data: {
        repository: {
          defaultBranchRef: {
            target: {
              history: {
                edges: {
                  node: {
                    additions: number
                    deletions: number
                    author: { user: { id: string } | null }
                  }
                }[]
                pageInfo: { endCursor: string | null; hasNextPage: boolean }
              }
            }
          } | null
        }
      }
    }

    const branch = data.repository.defaultBranchRef
    if (!branch) {
      return { additions, deletions, myCommits }
    }
    const { history } = branch.target
    for (const edge of history.edges) {
      if (edge.node.author.user?.id === OWNER_ID) {
        myCommits += 1
        additions += edge.node.additions
        deletions += edge.node.deletions
      }
    }
    if (!history.pageInfo.hasNextPage) {
      return { additions, deletions, myCommits }
    }
    cursor = history.pageInfo.endCursor
  }
}

interface CachedRepo extends RepoLoc {
  historyCount: number
}

const CACHE_PATH = `${import.meta.dir}/cache.json`

const locStats = async (
  edges: RepoEdge[]
): Promise<{ additions: number; deletions: number; commits: number }> => {
  const prevCache = (await Bun.file(CACHE_PATH)
    .json()
    .catch(() => ({}))) as Record<string, CachedRepo>
  const cache: Record<string, CachedRepo> = {}

  for (const edge of edges) {
    const name = edge.node.nameWithOwner
    const historyCount =
      edge.node.defaultBranchRef?.target.history.totalCount ?? 0
    const prev = prevCache[name]
    if (prev && prev.historyCount === historyCount) {
      cache[name] = prev
      continue
    }
    if (historyCount === 0) {
      cache[name] = {
        additions: 0,
        deletions: 0,
        historyCount: 0,
        myCommits: 0,
      }
      continue
    }
    const [owner, repoName] = name.split("/") as [string, string]
    // eslint-disable-next-line no-await-in-loop
    cache[name] = { historyCount, ...(await repoLoc(owner, repoName)) }
  }

  await Bun.write(CACHE_PATH, JSON.stringify(cache, null, 2))

  let additions = 0
  let deletions = 0
  let commits = 0
  for (const repo of Object.values(cache)) {
    additions += repo.additions
    deletions += repo.deletions
    commits += repo.myCommits
  }
  return { additions, commits, deletions }
}

const findAndReplace = (svg: string, id: string, text: string): string =>
  svg.replace(
    new RegExp(`(<[^>]*\\bid="${id}"[^>]*>)[^<]*(</)`, "u"),
    `$1${text}$2`
  )

const justify = (
  svg: string,
  id: string,
  value: number | string,
  length = 0
): string => {
  const text = typeof value === "number" ? value.toLocaleString("en-US") : value
  const replaced = findAndReplace(svg, id, text)
  const justLen = Math.max(0, length - text.length)
  let dotString = ` ${".".repeat(justLen)} `
  if (justLen === 0) {
    dotString = ""
  } else if (justLen === 1) {
    dotString = " "
  } else if (justLen === 2) {
    dotString = ". "
  }
  return findAndReplace(replaced, `${id}_dots`, dotString)
}

assert.equal(
  justify(`<tspan id="x">old</tspan><tspan id="x_dots">...</tspan>`, "x", 5),
  `<tspan id="x">5</tspan><tspan id="x_dots"></tspan>`,
  "justify() self-check failed"
)

const SVG_PATH = `${import.meta.dir}/readme.svg`

const main = async () => {
  const { repoCount, starCount } = await ownedRepoStats()
  const contributedEdges = await contributedRepos()
  const { additions, deletions, commits } = await locStats(contributedEdges)
  const followers = await followerCount()

  let svg = await Bun.file(SVG_PATH).text()
  svg = justify(svg, "repo_data", repoCount, 6)
  svg = justify(svg, "contrib_data", contributedEdges.length)
  svg = justify(svg, "star_data", starCount, 14)
  svg = justify(svg, "commit_data", commits, 22)
  svg = justify(svg, "follower_data", followers, 10)
  svg = justify(svg, "loc_data", additions - deletions, 9)
  svg = justify(svg, "loc_add", additions)
  svg = justify(svg, "loc_del", deletions, 7)
  await Bun.write(SVG_PATH, svg)
}

await main()
