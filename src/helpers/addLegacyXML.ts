import * as path from 'path';
import * as fs from 'fs-extra';
import * as Local from '@getflywheel/local';

/**
 * Add legacy run configuration and PHP server using php.xml and runConfigurations XML file.
 *
 * At some point, PhpStorm switched to use a newer format that's added using addWorkspaceXML().
 *
 * We add both legacy and newer formats to ensure that users on both older and newer versions of PhpStorm are covered.
 *
 * @see addWorkspaceXML()
 * @param site
 * @param serverUuid
 */
export default async function addLegacyXML (site: Local.Site, serverUuid: string) {
    const isLocalhost = site.host.includes('localhost');
    const port = isLocalhost ? site.httpPort : 80;
    const serverHost = isLocalhost ? 'localhost' : site.domain;

    const phpXML = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="PhpProjectServersManager">
    <servers>
      <server host="${serverHost}" port="${port}" id="${serverUuid}" name="Local"></server>
    </servers>
  </component>
</project>`;

    const LocalXML = `<component name="ProjectRunConfigurationManager">
  <configuration default="false" name="Local" type="PhpWebAppRunConfigurationType" factoryName="PHP Web Application" singleton="true" server_name="Local">
    <method />
  </configuration>
</component>`;

    await fs.ensureDir(path.join(site.paths.webRoot, '.idea', 'runConfigurations'));

    await fs.writeFile(path.join(site.paths.webRoot, '.idea', 'php.xml'), phpXML);
    await fs.writeFile(path.join(site.paths.webRoot, '.idea', 'runConfigurations', 'Local.xml'), LocalXML);
}
