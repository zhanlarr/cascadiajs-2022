const fetch = require('node-fetch')
require('dotenv').config()

/**
 * This script is used to launch the conference livestream using Mux.
 *
 * 1. Run script, this will create a Mux livestream object and connect it to both Twitter and Twitch
 * 2. Note the stream_key value that is returned
 * 3. Configure the conference live stream to send via RTMP to rtmps://global-live.mux.com:443/app using the stream_key
 * 4. Go to the Mux dashboard, click into the livestream resource, and note the public "Playback ID"
 * 5. Set the playback_id for the embedded Mux Video player
 *
 * Once you're ready to start the livestream:
 *
 * 1. Start streaming to the Mux endpoint
 * 2. Go to https://studio.twitter.com/producer/broadcasts and "Create broadcast", make it public, tweet it out
 *
 * No action for Twitch, it will automatically start streaming.
 *
 * See: https://docs.mux.com/guides/video/stream-live-to-3rd-party-platforms#2-select-a-simulcast-target-supported-by-mux
 */


async function createLivestream() {
    // create a payload for the REST API call that will initialize a livestream and simulcast it to both Twitter and Twitch
    let payload = {
        "playback_policy": [
          "public"
        ],
        "new_asset_settings": {
          "playback_policy": [
            "public"
          ]
        },
        "generated_subtitles": [
            {
              "name": "English CC (auto)",
              "passthrough": "English closed captions (auto-generated)",
              "language_code": "en-US"
            }
        ]
      }

    // call MUX API
    let response = await fetch(`https://api.mux.com/video/v1/live-streams`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${ process.env.MUX_TOKEN_ID }:${ process.env.MUX_TOKEN_SECRET }`, 'binary').toString('base64')
        },
        body:    JSON.stringify(payload),
    })
    const result = await response.json()
    console.log(result.data)
    return result.data.playback_ids[0].id
}

async function updatePlaybackId(env, password, playbackId) {
    let url
    if (env === 'testing') {
        url = 'http://localhost:3333'
    }
    else  {
        url = `https://${ env === 'staging' ? 'staging.' : '' }2022.cascadiajs.com`
    }
    // log-in
    let params = new URLSearchParams()
    params.append('password', password)
    let login = await fetch(`${url}/admin`, {method: 'POST', body: params, redirect: 'manual'})

    // get the session cookie
    let cookie = login.headers.get('set-cookie')

    // update the app setting
    params = new URLSearchParams()
    params.append('key', 'playbackId')
    params.append('value', playbackId)
    await fetch(`${url}/admin/settings/playbackId`, {
        method: 'POST',
        headers: { cookie },
        body:    params,
        redirect: 'manual'
    })
    console.log('Setting Updated: playbackId = ', playbackId)
}

async function main() {
    let env = process.argv[2]
    let password = process.argv[3]
    let playbackId = await createLivestream()
    await updatePlaybackId(env, password, playbackId)
}

main()
