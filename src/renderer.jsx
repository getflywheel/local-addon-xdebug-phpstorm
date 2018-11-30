import path from 'path';
import { FlyTooltip, Button } from 'local-components';

export default function (context) {

	const hooks = context.hooks;
	const userHome = context.environment.userHome;
	const fs = context.fileSystemJetpack;
	const notifier = context.notifier;
	const React = context.React;

	const configureIntelliJ = (event, site) => {

		const sitePath = site.path.replace('~/', userHome + '/').replace(/\/+$/,'') + '/';

		const publicCWD = fs.cwd(path.join(sitePath, './app/public'));

		const phpXML = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="PhpProjectServersManager">
    <servers>
      <server host="${site.domain}" id="${Math.round(Math.random() * 10000000)}" name="Local by Flywheel" use_path_mappings="true">
        <path_mappings>
          <mapping local-root="$PROJECT_DIR$" remote-root="/app/public" />
        </path_mappings>
      </server>
    </servers>
  </component>
</project>`;

		const LocalXML = `<component name="ProjectRunConfigurationManager">
  <configuration default="false" name="Local by Flywheel" type="PhpWebAppRunConfigurationType" factoryName="PHP Web Application" singleton="true" server_name="Local by Flywheel">
    <method />
  </configuration>
</component>`;

		publicCWD.write('./.idea/php.xml', phpXML);
		publicCWD.write('./.idea/runConfigurations/Local-By-Flywheel.xml', LocalXML);

		event.target.setAttribute('disabled', 'true');

		notifier.notify({
			title: 'Xdebug',
			message: 'IntelliJ IDEs have been configured for Xdebug.',
		});

	};

	hooks.addContent('siteInfoUtilities', (site) => {

		const button = (
			<Button className="--GrayOutline --Inline" disabled={site.environment !== 'custom'} onClick={(event) => {
				configureIntelliJ(event, site);
			}} ref="configure-intellij">
                Configure PhpStorm and IntelliJ IDEs
			</Button>
		);

		return (
			<li key="intellij-xdebug-integration"><strong>Xdebug</strong>
				<p>
					{site.environment === 'custom' ? button : <FlyTooltip content={'Xdebug is not compatible with Preferred sites.'}>
						{button}
					</FlyTooltip>}
				</p>
			</li>
		);

	});

}
