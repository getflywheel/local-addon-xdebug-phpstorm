import React from 'react';
import { TextButton, TableListRow } from '@getflywheel/local-components';
import { ipcRenderer } from 'electron';

export default function (context) {

	const { hooks } = context;

	hooks.addContent('siteInfoUtilities', (site) => {
		return (
			<TableListRow key="phpstorm-xdebug-integration" label="Xdebug + PhpStorm">
				<TextButton
					style={{paddingLeft: 0}}
					onClick={(event) => {
						ipcRenderer.send('add-phpstorm-xdebug-config', site.id);

						event.target.setAttribute('disabled', 'true');
					}}
				>
					Add Run Configuration to PhpStorm
				</TextButton>

				<p>
					<small>The run configuration will be added to the PhpStorm project settings in this site's app/public directory.</small>
				</p>
			</TableListRow>
		);
	});

}
