interface Info {
  appInfo: AppInfo;
  libs: Library[];
  changelog: Changelog[];
}

interface AppInfo {
  name: string;
  version: string;
  author: string;
  license: string;
  vcsLink: string;
}

interface Library {
  name: string;
  version: string;
  vcsLink: string;
}

interface Changelog {
  version: string;
  date: string;
  changes: string[];
}
