const download = require( '../download' );
const unzip = require( '../unzip' );
const { strFormat } = require( '../utils' );
const { Simitone } = require( '../../constants' ).downloads;

/**
 * Downloads and installs Simitone.
 */
class SimitoneInstaller {
  /**
   * @param {import('../../fsolauncher')} fsolauncher The FSOLauncher instance.
   * @param {string} path The path to the directory to create.
   */
  constructor( fsolauncher, path ) {
    this.fsolauncher = fsolauncher;
    this.id = Math.floor( Date.now() / 1000 );
    this.path = path;
    this.haltProgress = false;
    this.tempPath = `${global.appData}temp/artifacts-simitone-${this.id}.zip`;
    this.dl = download( {
      from: Simitone,
      to: this.tempPath
    } );
    this.simitoneVersion = '';
  }

  /**
   * Create/Update the download progress item.
   *
   * @param {string} message    The message to display.
   * @param {number} percentage The percentage to display.
   */
  createProgressItem( message, percentage ) {
    this.fsolauncher.IPC.addProgressItem(
      'FSOProgressItem' + this.id,
      'Simitone Client ' + this.simitoneVersion,
      global.locale.INS_IN + ' ' + this.path,
      message,
      percentage
    );
    this.fsolauncher.setProgressBar(
      percentage == 100 ? 2 : percentage / 100
    );
  }

  /**
   * Executes all installation steps in order and captures any errors.
   *
   * @returns {Promise<void>} A promise that resolves when the installation ends.
   */
  async install() {
    try {
      await this.step1();
      await this.step2();
      await this.step3();
      await this.step4();
      await this.step5();
      await this.step6();
      await this.step7();
      this.end();
    } catch ( err ) {
      this.error( err );
      throw err; // Send it back to the caller.
    }
  }

  /**
   * Obtains GitHub release data.
   */
  async step1() {
    const simitoneReleaseData = await this.fsolauncher.getSimitoneReleaseInfo();

    if ( simitoneReleaseData.tag_name !== undefined ) {
      this.simitoneVersion = simitoneReleaseData.tag_name;
    }

    return Promise.resolve();
  }

  /**
   * Download all the files.
   *
   * @returns {Promise<void>} A promise that resolves when the download is complete.
   */
  step2() {
    return this.download();
  }

  /**
   * Create the installation directory.
   *
   * @returns {Promise<void>} A promise that resolves when the directory is created.
   */
  step3() {
    return this.setupDir( this.path );
  }

  /**
   * Extract files into installation directory.
   *
   * @returns {Promise<void>} A promise that resolves when the files are extracted.
   */
  step4() {
    return this.extract();
  }

  /**
   * Create the FreeSO Registry Key.
   *
   * @returns {Promise<void>} A promise that resolves when the registry key is created.
   */
  step5() {
    return require( '../registry' ).createSimitoneEntry( this.fsolauncher, this.path );
  }

  /**
   * Downloads Mac-extras for Darwin.
   *
   * @returns {Promise<void>} A promise that resolves when the download is complete.
   */
  step6() {
    if ( process.platform === 'darwin' ) {
      this.dl = download( {
        from: 'https://beta.freeso.org/LauncherResourceCentral/MacExtras',
        to: `${global.appData}temp/macextras-${this.id}.zip`
      } );
      return this.download();
    }
    return Promise.resolve();
  }

  /**
   * Installs Mac-extras for Darwin.
   *
   * @returns {Promise<void>} A promise that resolves when the installation is complete.
   */
  step7() {
    if ( process.platform === 'darwin' ) {
      return unzip( {
        from: `${global.appData}temp/macextras-${this.id}.zip`,
        to: this.path,
        cpperm: true
      }, filename => {
        this.createProgressItem(
          global.locale.INS_EXTRACTING_ME + ' ' + filename, 100
        );
      } );
    }
    return Promise.resolve();
  }

  /**
   * When the installation ends.
   */
  end() {
    this.dl.cleanup();
    this.createProgressItem( global.locale.INSTALLATION_FINISHED, 100 );
    this.fsolauncher.IPC.stopProgressItem( 'FSOProgressItem' + this.id );
    if ( this.simitoneVersion ) {
      this.fsolauncher.setConfiguration( [
        'Game', 'SimitoneVersion', this.simitoneVersion
      ] );
    }
  }

  /**
   * When the installation errors out.
   *
   * @param {Error} _err The error object.
   */
  error( _err ) {
    this.dl.cleanup();
    this.haltProgress = true;
    this.createProgressItem( strFormat( global.locale.FSO_FAILED_INSTALLATION, 'Simitone' ), 100 );
    this.fsolauncher.IPC.stopProgressItem( 'FSOProgressItem' + this.id );
  }

  /**
   * Downloads the distribution file.
   *
   * @returns {Promise<void>} A promise that resolves when the download is complete.
   */
  download() {
    return new Promise( ( resolve, reject ) => {
      this.dl.run();
      this.dl.events.on( 'error', () => {} );
      this.dl.events.on( 'end', _fileName => {
        if ( this.dl.hasFailed() ) {
          return reject( global.locale.FSO_NETWORK_ERROR );
        }
        resolve();
      } );
      this.updateDownloadProgress();
    } );
  }

  /**
   * Extracts the zipped artifacts.
   *
   * @returns {Promise<void>} A promise that resolves when the extraction is complete.
   */
  extract() {
    return unzip( { from: this.tempPath, to: this.path }, filename => {
      this.createProgressItem(
        global.locale.EXTRACTING_CLIENT_FILES + ' ' + filename,
        100
      );
    } );
  }

  /**
   * Deletes the downloaded artifacts file.
   */
  cleanup() {
    const fs = require( 'fs-extra' );
    fs.stat( this.tempPath, ( err, _stats ) => {
      if ( err ) {
        return;
      }
      fs.unlink( this.tempPath, err => {
        if ( err ) return console.error( err );
      } );
    } );
  }

  /**
   * Creates all the directories and subfolders in a path.
   *
   * @param {string} dir The path to create.
   *
   * @returns {Promise<void>} A promise that resolves when the directory is created.
   */
  setupDir( dir ) {
    return new Promise( ( resolve, reject ) => {
      require( 'fs-extra' ).ensureDir( dir, err => {
        if ( err ) return reject( err );
        resolve();
      } );
    } );
  }

  /**
   * Checks if Simitone is already installed in a given path.
   *
   * @returns {Promise<boolean>} If Simitone is installed already.
   */
  isInstalledInPath() {
    return new Promise( ( resolve, _reject ) => {
      require( 'fs-extra' ).stat( this.path + '/Simitone.Windows.exe', err => {
        resolve( err == null );
      } );
    } );
  }

  /**
   * Updates the progress item with the download progress.
   */
  updateDownloadProgress() {
    setTimeout( () => {
      let p = this.dl.getProgress();
      const mb = this.dl.getProgressMB(),
        size = this.dl.getSizeMB();

      if ( isNaN( p ) ) p = 0;
      if ( p < 100 ) {
        if ( ! this.haltProgress ) {
          this.createProgressItem(
            `${global.locale.DL_CLIENT_FILES} ${mb} MB ${global.locale.X_OUT_OF_X} ${size} MB (${p}%)`,
            p
          );
        }

        return this.updateDownloadProgress();
      }
    }, 250 );
  }
}

module.exports = SimitoneInstaller;
