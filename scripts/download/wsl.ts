// WSL-related downloads for rancher-desktop development.
// Note that this does _not_ include installing WSL on the machine.

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import { DownloadContext } from 'scripts/lib/dependencies';

import { download } from '../lib/download';

function extract(resourcesPath: string, file: string, expectedFile: string): void {
  const systemRoot = process.env.SystemRoot;

  if (!systemRoot) {
    throw new Error('Could not find system root');
  }
  const bsdTar = path.join(systemRoot, 'system32', 'tar.exe');

  spawnSync(
    bsdTar,
    ['-xzf', file, expectedFile],
    {
      cwd:   resourcesPath,
      stdio: 'inherit',
    });
  fs.rmSync(file, { maxRetries: 10 });
}

// TODO(@Nino-k) once host-resolver stabilizes remove and add to wsl-distro
export async function downloadHostResolverPeer(context: DownloadContext, version: string): Promise<void> {
  const baseURL = 'https://github.com/rancher-sandbox/rancher-desktop-host-resolver/releases/download';
  const tarName = `host-resolver-${ version }-linux-amd64.tar.gz`;
  const resolverVsockPeerURL = `${ baseURL }/${ version }/${ tarName }`;
  const resolverVsockPeerPath = path.join(context.internalDir, tarName );

  await download(
    resolverVsockPeerURL,
    resolverVsockPeerPath,
    { access: fs.constants.W_OK });

  extract(context.internalDir, resolverVsockPeerPath, 'host-resolver');
}

export async function downloadHostResolverHost(context: DownloadContext, version: string): Promise<void> {
  const baseURL = 'https://github.com/rancher-sandbox/rancher-desktop-host-resolver/releases/download';
  const zipName = `host-resolver-${ version }-windows-amd64.zip`;
  const resolverVsockHostURL = `${ baseURL }/${ version }/${ zipName }`;
  const resolverVsockHostPath = path.join(context.internalDir, zipName);

  await download(
    resolverVsockHostURL,
    resolverVsockHostPath,
    { access: fs.constants.W_OK });

  extract(context.internalDir, resolverVsockHostPath, 'host-resolver.exe');
}

export async function downloadWSLDistro(context: DownloadContext, version: string): Promise<void> {
  const baseUrl = 'https://github.com/rancher-sandbox/rancher-desktop-wsl-distro/releases/download';
  const versionWithV = `v${ version }`;
  const tarName = `distro-${ version }.tar`;
  const url = `${ baseUrl }/v${ versionWithV }/${ tarName }`;

  await download(url, path.join(context.resourcesDir, tarName), { access: fs.constants.W_OK });
}
