let Layout = require('../layout/home')

module.exports = async function Index({ ticket, rsvp, activities, message }) {
    let clientID = process.env.GITHUB_CLIENT_ID
    let { full_name, number, release_slug } = ticket
    let isInPerson = process.env.TITO_INPERSON_SLUGS.split(',').indexOf(release_slug) >= 0
    let isVirtual = process.env.TITO_VIRTUAL_SLUGS.split(',').indexOf(release_slug) >= 0
    //console.log(process.env.TITO_INPERSON_SLUGS, ticket)
    let content = /*html*/`
        <div id=page>
            <div class=page-title><div><h1>Hello ${ full_name }!</h1></div></div>
            <div id="home" class="page-body narrow">
                ${ message ? `<p><span class="highlight warning">${ message }</span></p>` : ``}
                <h2>Hallway Track</h2>
                <h3>Conference Directory</h3>
                ${ ticket.github && ticket.github !== ''
                    ? /*html*/`<p>You have been added to the Conference Directory ✅<p>
                    <h3>Virtual Ticket</h3>
                    <p><img src="${ process.env.BEGIN_STATIC_ORIGIN }/ticket-${ number }.png" alt="image of virtual ticket" width="500"/></p>
                    <p>Anyone who registers via your virtual ticket page gets 10% off!</p>
                    <p>
                        <a target="_blank" href="https://twitter.com/intent/tweet?text=${ encodeURIComponent(`I just bought a ticket to #CascadiaJS 2022! If you register using my virtual ticket link, you'll save 10%!\n\nhttps://2022.cascadiajs.com/tickets/${ number }`) }">Share on Twitter</a> 
                        <a target="_blank" href="/tickets/${ number }">Direct Link</a>
                    </p>
                    `
                    : /*html*/`<p>Let folks know you're attending CascadiaJS this year! We use <a target="_blank" href="https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps">Github OAuth</a> to retrieve your profile photo and add it to our Conference Directory. We will also generate a customized virtual ticket that will include a discount code for you to share with your friends!</p>
                    <div class="cta secondary"><a href="https://github.com/login/oauth/authorize?client_id=${ clientID }">Get Added to Directory</a></div>`
                }
                ${ isVirtual
                    ? /*html*/`
                        <h3>Gather</h3>
                        <p>Gather is the virtual event space that we have fully customized for your enjoyment. Walk around, meet new people and even watch the Livestream!</p>
                        <div class="cta secondary"><a target="_gather" href="https://app.gather.town/events/DLM6I5xJNNbT62oqPaqa">Join Gather</a></div>`
                    : ``
                }
                <h3>Discord</h3>
                <p>Discord is the text chat experience, complete with the animated gifs and reactions that you love.</p>
                <div class="cta secondary"><a target="_discord" href="https://discord.gg/cascadiajs">Join Discord</a></div>
                <!--h3>Video Selfie Booth</h3>
                <p>Hop into the CascadiaJS Video Selfie Booth! Record yourself saying "hello", download the animated gif, and share it in the Discord and on Twitter!</p>
                <div class="cta secondary"><a target="_booth" href="#">Video Selfie Booth</a></div-->
                ${ isInPerson
                    ? /*html*/`
                        <h2>Workshop Track</h2>
                        <p>These workshops are FREE to all in-person attendees!</p>
                        <table id="workshop-rsvp">
                            <tr><td>8/31 @ 10:30am</td><td><a href="/workshops/alerts-nodejs-courier">Sending Multi-channel Alerts From Your Node.JS Environment with Courier</a></td><td><a target="_blank" href="https://ti.to/event-loop/cascadiajs-2022/with/7bcjwyo4ys">RSVP</a></td></tr>
                            <tr><td>8/31 @ 1:30pm</td><td><a href="/workshops/babylonjs-metaverse">Learn Babylon.js to Create Your Own 3D Metaverse Environments</a></td><td><a target="_blank" href="https://ti.to/event-loop/cascadiajs-2022/with/dviiwcsynwc">RSVP</a></td></tr>
                            <tr><td>9/1 @ 10:30am</td><td><a href="/workshops/digital-payments-circle">Connecting the Fiat and Crypto Worlds with Digital Dollars</a></td><td><a target="_blank" href="https://ti.to/event-loop/cascadiajs-2022/with/3ocrs1jwc7w">RSVP</a></td></tr>
                            <tr><td>9/1 @ 1:30pm</td><td><a href="/workshops/ecommerce-cloudinary">Performance-First Ecommerce & Visual Web Experiences with Cloudinary</a></td><td><a target="_blank" href="https://ti.to/event-loop/cascadiajs-2022/with/b8h7ytftg3c">RSVP</a></td></tr>
                        </table>
                        <h2>Activity Track</h2>
                        <p>Choose your own adventure and register to your Activity of choice! The Activity Track will take place on the afternoon of Day One, August 31. Please <a href="/conference/activities">review the descriptions</a> of each activity before you make your selection. You can "un-register" anytime and make a new selection if there are spots open.</p>
                        <table>
                            <tr><th>Activity</th></tr>
                            ${ activities.map((a) => `
                            <tr>
                                <td>${ a.name }</td>
                                <td>
                                    <form action=/home/rsvp method=post>
                                        <input type=hidden name=activityKey value=${ a.key } />
                                    ${ rsvp
                                        ? rsvp.activity === a.key
                                            ? a.key === 'kayaking'
                                                ? `<button disabled>Email us to Un-Register</button>`
                                                : `<input type=submit name=unregister value="Un-Register" />`
                                            : a.full
                                                ? a.key === 'kayaking'
                                                    ? `<button disabled>Email us to Register</button>`
                                                    : `<button disabled>Max Limit Reached</button>`
                                                : `<button disabled>Register</button>`
                                        :  a.full
                                            ? a.key === 'kayaking'
                                                ? `<button disabled>Email us to Register</button>`
                                                : `<button disabled>Max Limit Reached</button>`
                                            : `<input type=submit name=register value=Register />`
                                    }
                                    </form>
                                </td>
                            </tr>
                            `).join('')}
                        </table>
                        `
                    : ``
                }
                <h2>Need Help?</h2>
                <p>Please contact us in the <a target="_blank" href="https://discord.gg/cascadiajs">Discord</a> at #help-questions.</p>
                <form action=/home/login method=post>
                    <input type=hidden name=reset value=reset/>
                    <button>Log Out</button>
                </form>
            </div>
        </div>
    `
    let html = Layout({ content, view: 'dashboard' })
    return { html }
}
