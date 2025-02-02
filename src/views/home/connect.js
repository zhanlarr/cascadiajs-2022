let Layout = require('../layout/home')

module.exports = async function({ ticket, connections }) {
    let content = /*html*/`
        <div id=page>
            <div class=page-title><div><h1>Connect 🤝</h1></div></div>
            <div class=page-body class=narrow>
            <h2>Make a Connection</h2>
            <iframe id="retool-app" height="400" style="border:none" src="https://retoolin.tryretool.com/embedded/public/3997468d-a0cf-4d2f-b18e-055db698b133?auth_hash=${ ticket.auth_hash }"></iframe>
            <h2>Your Connections</h2>
            ${ connections.map((c) => /*html*/`
                <details>
                    <summary>${ c.to_data.full_name }</summary>
                    <ul>
                        <li>${ c.to_data.email_share }</li>
                        ${ c.to_data.linkedin ? `<li>${ c.to_data.linkedin }</li>` : `` }
                        ${ c.to_data.twitter ? `<li>${ c.to_data.twitter }</li>` : `` }
                    </ul>
                </details>
            `).join('')}
            </div>
        </div>
    `
    let html = Layout({ content, view: 'connect' })
    return { html }
}
