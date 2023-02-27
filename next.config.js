// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const isGithubActions = process.env.GITHUB_ACTIONS || false

let assetPrefix = ''
let basePath = '/'

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}

module.exports = {
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    unoptimized: true
    // loader: 'imgix',
    // domains: [
    //         'www.notion.so',
    //         'notion.so',
    //         'images.unsplash.com',
    //         'pbs.twimg.com',
    //         'abs.twimg.com',
    //         's3.us-west-2.amazonaws.com',
    //         'transitivebullsh.it'
    //       ],
    // formats: ['image/avif', 'image/webp'],
    // dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

// module.exports = withBundleAnalyzer({
//   staticPageGenerationTimeout: 300,
//   images: {
//     domains: [
//       'www.notion.so',
//       'notion.so',
//       'images.unsplash.com',
//       'pbs.twimg.com',
//       'abs.twimg.com',
//       's3.us-west-2.amazonaws.com',
//       'transitivebullsh.it'
//     ],
//     formats: ['image/avif', 'image/webp'],
//     dangerouslyAllowSVG: true,
//     contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
//     loader: 'akamai',
//   }
// })
