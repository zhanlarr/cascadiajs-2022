let arc = require('@architect/functions')
let data = require('@begin/data')

exports.handler = arc.http.async(auth, uploadOrUpsert)

/** ensure session */
async function auth(req) {
  if (!req.session.loggedIn)
    return { location: '/' }
}

async function uploadOrUpsert(req) {
  if (req.params.key === 'upload') {
    return await upload(req)
  }
  else {
    return await upsert(req)
  }
}

/** write to begin/data */
async function upsert(req) {
  if (!req.body.key)
    req.body.key = req.body.name.toLowerCase().replace(/ /, '-')

  req.body.topics = req.body.topics.split(",")
    // fixes case of spaces in topics 'a,  b,  c , d'
    // allows for spaces in topic names like 'machine learning'
   .map(t => t.trim())

  await data.set({
    table: 'speakers',
    ...req.body
  })

  return { location: '/admin' }
}

/** write to begin/data */
async function upload(req) {
  let speakers = req.body
  for (let i in speakers) {
    let speaker = speakers[i]
    await data.set({
      table: 'speakers',
      ...speaker
    })
  }

  return {
    statusCode: 201,
    body: JSON.stringify({success: true})
  }
}

