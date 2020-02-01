import * as Local from '@getflywheel/local';
import * as LocalMain from '@getflywheel/local/main';
import uuidv4 from 'uuid/v4';
import addLegacyXML from './helpers/addLegacyXML';
import addWorkspaceXML from './helpers/addWorkspaceXML';

export default function(context) {
    const { notifier, electron } : { notifier: any, electron: typeof Electron } = context;

    electron.ipcMain.on('add-phpstorm-xdebug-config', async (event, siteId: Local.Site['id']) => {

        const site = LocalMain.SiteData.getSite(siteId);

        const serverUuid = uuidv4();

        try {
            await addLegacyXML(site, serverUuid);
            await addWorkspaceXML(site, serverUuid);

            notifier.notify({
                title: 'Xdebug + PhpStorm',
                message: `Local's Xdebug Run Configuration and Server has been added to PhpStorm.`,
            });
        } catch (e) {
            notifier.notify({
                title: 'Xdebug + PhpStorm Error',
                message: `Unable to add Run Configuration and Server.`,
            });

            electron.dialog.showErrorBox('Xdebug + PhpStorm Error', e.stack);
        }
    });
}
