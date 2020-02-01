import * as path from 'path';
import * as fs from 'fs-extra';
import * as Local from '@getflywheel/local';
import {JSDOM} from 'jsdom';

/**
 * Add run configuration and PHP server using newer format in workspace.xml.
 *
 * We add both legacy and newer formats to ensure that users on both older and newer versions of PhpStorm are covered.
 *
 * @see addLegacyXML()
 * @param site
 * @param serverUuid
 */
export default async function addWorkspaceXML (site: Local.Site, serverUuid: string) {
    const isLocalhost = site.host.includes('localhost');
    const port = isLocalhost ? site.httpPort : 80;
    const serverHost = isLocalhost ? 'localhost' : site.domain;

    const workspaceXmlPath = path.join(site.paths.webRoot, '.idea', 'workspace.xml');

    const dom = new JSDOM(await fs.readFile(workspaceXmlPath), {
        contentType: 'text/xml'
    });

    const $ = dom.window.document;

    const addServer = () => {
        /* Remove existing Local server */
        $.querySelector(`component[name="PhpServers"] server[name="Local"]`)?.remove();

        /* Ensure that PHP Servers component exists */
        if (!$.querySelector(`component[name="PhpServers"]`)) {
            $.querySelector(`project`)?.insertAdjacentHTML('afterbegin', '<component name="PhpServers"></component>');
        }

        if (!$.querySelector(`component[name="PhpServers"] servers`)) {
            $.querySelector(`component[name="PhpServers"]`)?.insertAdjacentHTML('beforeend', '<servers></servers>');
        }

        /* Add Server */
        $.querySelector(`component[name="PhpServers"] servers`)!
            .insertAdjacentHTML('beforeend', `<server host="${serverHost}" id="${serverUuid}" name="Local" port="${port}" />`);
    };

    const addRunConfiguration = () => {
        /* Remove existing Local run configuration */
        $.querySelector(`component[name="RunManager"] configuration[name="Local"]`)?.remove();

        /* Ensure that Run Manager exists */
        if (!$.querySelector(`component[name="RunManager"]`)) {
            $.querySelector(`project`)?.insertAdjacentHTML('beforeend', '<component name="RunManager"></component>');
        }

        /* Add Run Configuration */
        $.querySelector(`component[name="RunManager"]`)
            ?.insertAdjacentHTML('beforeend',
                `<configuration name="Local" type="PhpWebAppRunConfigurationType" factoryName="PHP Web Application" server_name="Local">
                       <method v="2" />
                    </configuration>`,
            );
    };

    addServer();
    addRunConfiguration();

    const xml = `<?xml version="1.0" encoding="${dom.window.document.characterSet}"?>\n${dom.serialize()}`;

    await fs.writeFileSync(workspaceXmlPath, xml);
}
