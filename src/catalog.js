// Fixed allowlist of the eight Zero Series titles. Publication evidence and
// source revision are separate: a repository implementation is not a release.
// Recheck docs/evidence/catalog.md before enabling a new URL or ranking scope.
const OFFICIAL_PLAY_URLS = Object.freeze({
  kaisen: 'https://chameleonjp-lab.github.io/kaisen/',
  faitofuraito: 'https://chameleonjp-lab.github.io/faitofuraito/',
});

export const catalog = [
  {
    "id": "kaisen",
    "displayOrder": 1,
    "title": "カイセン",
    "description": "自機と4機の僚機で、敵航空機と戦艦を撃破する海上空戦のタイムアタック。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/kaisen/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/kaisen",
    "sourceCommit": "3d751051dc6212482a129e8da596ddd349b2f9f5",
    "sourceRoot": "https://github.com/chameleonjp-lab/kaisen/tree/3d751051dc6212482a129e8da596ddd349b2f9f5",
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/kaisen/",
      "candidateUrl": null,
      "deployedCommit": "3d751051dc6212482a129e8da596ddd349b2f9f5",
      "checkedAt": "2026-10-05T03:52:34.410Z",
      "method": [
        "README official URL",
        "TLS-verified HTML, deployment manifest and JavaScript/CSS bodies; SHA-256 equality",
        "Chromium home readiness from exact deployed-byte replay; GET/HEAD allowlist, all external requests and mutations blocked"
      ],
      "sources": [
        "https://github.com/chameleonjp-lab/kaisen/blob/3d751051dc6212482a129e8da596ddd349b2f9f5/README.md",
        "https://github.com/chameleonjp-lab/kaisen/blob/3d751051dc6212482a129e8da596ddd349b2f9f5/docs/DEPLOYMENT.md",
        "https://chameleonjp-lab.github.io/kaisen/deployment.json",
        "https://github.com/chameleonjp-lab/kaisen/actions/runs/37242180604"
      ],
      "unknown": [
        "Direct live Chromium HTTPS inspection blocked by managed proxy CA trust",
        "Gameplay, scoring, audio and physical iPhone operation were not tested"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "artifactHashes": {
        "index.html": "ce4fc2a6af98bf8bfc437f5e7d9b903f45d183132a58eb0bccdb301d355d5d05",
        "assets/index-D79zFkmg.js": "9f3ecec88b461c2fe163216bc45751b6973d5978a195ed1483ac51917951ff36",
        "assets/index-DoDftaxZ.css": "470c3b2f05659b37212eb5b20ca1897138b7a509d939bb8f77314d0b9662f8b6"
      },
      "homeCheck": {
        "method": "deployed_byte_replay",
        "browser": "153.0.8010.12",
        "viewport": {
          "width": 393,
          "height": 852
        },
        "homeVisible": true,
        "startEnabled": true,
        "pageErrorCount": 0,
        "gameStarted": false,
        "externalRequestCount": 0
      },
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 37242180604,
        "headCommit": "3d751051dc6212482a129e8da596ddd349b2f9f5",
        "conclusion": "success",
        "completedRecordAt": "2026-10-04T23:02:27Z"
      }
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-05T03:53:32Z"
  },
  {
    "id": "faitofuraito",
    "displayOrder": 2,
    "title": "ファイトフライト",
    "description": "零戦二一型を題材に、操縦と射撃を楽しむ空戦ゲーム。時間無制限のノーマルと、5分間のイージーを選べます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/faitofuraito/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/faitofuraito",
    "sourceCommit": "c2b313d37875b93458032d98636fcf5b5d30a138",
    "sourceRoot": "https://github.com/chameleonjp-lab/faitofuraito/tree/c2b313d37875b93458032d98636fcf5b5d30a138",
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/faitofuraito/",
      "candidateUrl": null,
      "deployedCommit": "037e7914572871f18eb9aa9a41eca4fdae9f3bc7",
      "checkedAt": "2026-10-05T03:52:35.267Z",
      "method": [
        "README official URL",
        "TLS-verified HTML, deployment manifest and JavaScript/CSS bodies; SHA-256 equality",
        "Chromium home readiness from exact deployed-byte replay; GET/HEAD allowlist, all external requests and mutations blocked"
      ],
      "sources": [
        "https://github.com/chameleonjp-lab/faitofuraito/blob/c2b313d37875b93458032d98636fcf5b5d30a138/README.md",
        "https://github.com/chameleonjp-lab/faitofuraito/blob/c2b313d37875b93458032d98636fcf5b5d30a138/public/ranking-manifest.json",
        "https://chameleonjp-lab.github.io/faitofuraito/deployment.json",
        "https://github.com/chameleonjp-lab/faitofuraito/blob/8d22fa535e2f107745710b37df5c92b2ab1b763b/deployment.json"
      ],
      "unknown": [
        "Direct live Chromium HTTPS inspection blocked by managed proxy CA trust",
        "Gameplay, scoring, audio and physical iPhone operation were not tested",
        "Deployed source differs from current main; main-only updates are not claimed as deployed"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "artifactHashes": {
        "index.html": "ddb26ff81e70ea99ab514b34a7a200ed700e7f4031602f8fa45a1e4f9a8efdf2",
        "assets/index-mKVNiF0f.js": "94d35d736119c7fb8dd6fc035e7d21402e23f792c720a89be3de9f5f17a5925b",
        "assets/index-DA8nm5ZM.css": "d2e44f2c526697256fb0b181a707db529822fcc86c2b0c9413d1f80962c20507"
      },
      "homeCheck": {
        "method": "deployed_byte_replay",
        "browser": "153.0.8010.12",
        "viewport": {
          "width": 393,
          "height": 852
        },
        "homeVisible": true,
        "startEnabled": true,
        "pageErrorCount": 0,
        "gameStarted": false,
        "externalRequestCount": 0
      },
      "deployedBranchCommit": "8d22fa535e2f107745710b37df5c92b2ab1b763b"
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": "normal",
      "modes": [
        {
          "id": "normal",
          "label": "ノーマル",
          "gameSlug": "faitofuraito_normal",
          "rulesVersion": null,
          "contractVersion": null,
          "score": {
            "unit": "点",
            "scale": 1,
            "decimals": 0,
            "order": "desc"
          },
          "verification": null
        },
        {
          "id": "easy",
          "label": "イージー",
          "gameSlug": "faitofuraito_easy",
          "rulesVersion": null,
          "contractVersion": null,
          "score": {
            "unit": "点",
            "scale": 1,
            "decimals": 0,
            "order": "desc"
          },
          "verification": null
        }
      ]
    },
    "contentUpdatedAt": "2026-10-05T03:53:32Z"
  },
  {
    "id": "machimamore",
    "displayOrder": 3,
    "title": "マチマモレ",
    "description": "街を攻撃する円盤UFOを、味方戦闘機と迎撃する都市防衛ゲームを予定しています。現在は仕様・計画の準備段階です。",
    "releaseState": "preparing",
    "playUrl": null,
    "repositoryUrl": "https://github.com/chameleonjp-lab/machimamore",
    "sourceCommit": "4cefae935236f2b8bb6a9e5895ddd05220883eb2",
    "sourceRoot": "https://github.com/chameleonjp-lab/machimamore/tree/4cefae935236f2b8bb6a9e5895ddd05220883eb2",
    "publicationEvidence": {
      "verified": false,
      "officialUrl": null,
      "candidateUrl": null,
      "deployedCommit": null,
      "checkedAt": "2026-10-05T03:49:58Z",
      "method": [
        "Official repository main, README and fixed source documents",
        "Public repository metadata: homepage null",
        "Repository has_pages false; this does not exclude unrecorded alternate hosts"
      ],
      "sources": [
        "https://github.com/chameleonjp-lab/machimamore/blob/4cefae935236f2b8bb6a9e5895ddd05220883eb2/README.md",
        "https://github.com/chameleonjp-lab/machimamore/blob/4cefae935236f2b8bb6a9e5895ddd05220883eb2/docs/REQUIREMENTS.md"
      ],
      "unknown": [
        "No verified current playable deployment URL"
      ],
      "evidenceFile": "docs/evidence/catalog.md"
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-05T03:53:32Z"
  },
  {
    "id": "gekichin",
    "displayOrder": 4,
    "title": "ゲキチン",
    "description": "超大型宇宙船の100基の砲台を、僚機と破壊するタイム・スコアアタックを予定しています。現在は操縦プロトタイプを開発中で、砲台戦は未実装です。",
    "releaseState": "preparing",
    "playUrl": null,
    "repositoryUrl": "https://github.com/chameleonjp-lab/gekichin",
    "sourceCommit": "98119b5ae6604ad5975024b0e523b78eef369662",
    "sourceRoot": "https://github.com/chameleonjp-lab/gekichin/tree/98119b5ae6604ad5975024b0e523b78eef369662",
    "publicationEvidence": {
      "verified": false,
      "officialUrl": null,
      "candidateUrl": null,
      "deployedCommit": null,
      "checkedAt": "2026-10-05T03:49:58Z",
      "method": [
        "Official repository main, README and fixed source documents",
        "Public repository metadata: homepage null",
        "Repository has_pages false; this does not exclude unrecorded alternate hosts"
      ],
      "sources": [
        "https://github.com/chameleonjp-lab/gekichin/blob/98119b5ae6604ad5975024b0e523b78eef369662/README.md",
        "https://github.com/chameleonjp-lab/gekichin/blob/98119b5ae6604ad5975024b0e523b78eef369662/docs/REQUIREMENTS.md",
        "https://github.com/chameleonjp-lab/gekichin/blob/98119b5ae6604ad5975024b0e523b78eef369662/docs/IMPLEMENTATION_STATUS.md"
      ],
      "unknown": [
        "No verified current playable deployment URL"
      ],
      "evidenceFile": "docs/evidence/catalog.md"
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-05T03:53:32Z"
  },
  {
    "id": "uchiotose",
    "displayOrder": 5,
    "title": "ウチオトセ",
    "description": "味方艦隊と戦闘機で、浮遊島から出撃する飛行戦士と戦う海上空戦ゲーム。戦闘実装は進んでいますが、公開入口は確認中です。",
    "releaseState": "unverified",
    "playUrl": null,
    "repositoryUrl": "https://github.com/chameleonjp-lab/uchiotose",
    "sourceCommit": "14090299b5d1f67502210fe51e1c04799770d817",
    "sourceRoot": "https://github.com/chameleonjp-lab/uchiotose/tree/14090299b5d1f67502210fe51e1c04799770d817",
    "publicationEvidence": {
      "verified": false,
      "officialUrl": null,
      "candidateUrl": "https://chameleonjp-lab.github.io/uchiotose/",
      "deployedCommit": null,
      "checkedAt": "2026-10-05T03:49:58Z",
      "method": [
        "Official repository main, README and fixed source documents",
        "Public repository metadata: homepage null",
        "Repository has_pages false; this does not exclude unrecorded alternate hosts"
      ],
      "sources": [
        "https://github.com/chameleonjp-lab/uchiotose/blob/14090299b5d1f67502210fe51e1c04799770d817/README.md",
        "https://github.com/chameleonjp-lab/uchiotose/blob/14090299b5d1f67502210fe51e1c04799770d817/docs/REQUIREMENTS.md",
        "https://github.com/chameleonjp-lab/uchiotose/blob/14090299b5d1f67502210fe51e1c04799770d817/docs/IMPLEMENTATION_RELEASE.md",
        "https://github.com/chameleonjp-lab/uchiotose/blob/14090299b5d1f67502210fe51e1c04799770d817/docs/DEPLOYMENT.md"
      ],
      "unknown": [
        "No verified current playable deployment URL"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "candidateUrlLabel": "Expected URL in deployment plan, not a confirmed publication",
      "candidateResponseStatus": 404
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-05T03:53:32Z"
  },
  {
    "id": "senryou",
    "displayOrder": 6,
    "title": "センリョウ",
    "description": "戦闘機で地上戦へ介入し、歩兵による拠点占領を支援する一戦完結型ゲーム。実装候補の検証を進めており、公開入口は確認中です。",
    "releaseState": "unverified",
    "playUrl": null,
    "repositoryUrl": "https://github.com/chameleonjp-lab/senryou",
    "sourceCommit": "71b0e5bc9ffbe2cbd1f295160b9e8e3c40ad6650",
    "sourceRoot": "https://github.com/chameleonjp-lab/senryou/tree/71b0e5bc9ffbe2cbd1f295160b9e8e3c40ad6650",
    "publicationEvidence": {
      "verified": false,
      "officialUrl": null,
      "candidateUrl": null,
      "deployedCommit": null,
      "checkedAt": "2026-10-05T03:49:58Z",
      "method": [
        "Official repository main, README and fixed source documents",
        "Public repository metadata: homepage null",
        "Repository has_pages false; this does not exclude unrecorded alternate hosts"
      ],
      "sources": [
        "https://github.com/chameleonjp-lab/senryou/blob/71b0e5bc9ffbe2cbd1f295160b9e8e3c40ad6650/README.md",
        "https://github.com/chameleonjp-lab/senryou/blob/71b0e5bc9ffbe2cbd1f295160b9e8e3c40ad6650/docs/VERIFICATION.md"
      ],
      "unknown": [
        "No verified current playable deployment URL"
      ],
      "evidenceFile": "docs/evidence/catalog.md"
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-05T03:53:32Z"
  },
  {
    "id": "fantasia",
    "displayOrder": 7,
    "title": "ファンタジア",
    "description": "剣と魔法の世界で、7方面へ進む味方軍を戦闘機で支援する占領戦タイムアタック。実装候補の受入検証が残っており、公開に向けて準備中です。",
    "releaseState": "preparing",
    "playUrl": null,
    "repositoryUrl": "https://github.com/chameleonjp-lab/fantasia",
    "sourceCommit": "36b0e3b8130acb7149a646845b46f72294a3798a",
    "sourceRoot": "https://github.com/chameleonjp-lab/fantasia/tree/36b0e3b8130acb7149a646845b46f72294a3798a",
    "publicationEvidence": {
      "verified": false,
      "officialUrl": null,
      "candidateUrl": null,
      "deployedCommit": null,
      "checkedAt": "2026-10-05T03:49:58Z",
      "method": [
        "Official repository main, README and fixed source documents",
        "Public repository metadata: homepage null",
        "Repository has_pages false; this does not exclude unrecorded alternate hosts"
      ],
      "sources": [
        "https://github.com/chameleonjp-lab/fantasia/blob/36b0e3b8130acb7149a646845b46f72294a3798a/README.md",
        "https://github.com/chameleonjp-lab/fantasia/blob/36b0e3b8130acb7149a646845b46f72294a3798a/docs/FANTASIA_SPEC.md",
        "https://github.com/chameleonjp-lab/fantasia/blob/36b0e3b8130acb7149a646845b46f72294a3798a/docs/DELIVERY_STATUS.md",
        "https://github.com/chameleonjp-lab/fantasia/blob/36b0e3b8130acb7149a646845b46f72294a3798a/docs/RELEASE_GATE.json"
      ],
      "unknown": [
        "No verified current playable deployment URL"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "releaseGateReady": false
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-05T03:53:32Z"
  },
  {
    "id": "nusumidase",
    "displayOrder": 8,
    "title": "ヌスミダセ",
    "description": "敵の空中基地から機密コアを奪い、僚機とともに自基地へ持ち帰る、一人用の空中旗取りゲームを予定しています。仕様・実装計画を整備中です。",
    "releaseState": "preparing",
    "playUrl": null,
    "repositoryUrl": "https://github.com/chameleonjp-lab/nusumidase",
    "sourceCommit": "c604c7990e5ba9a599898ede6c1ccb4b42970b51",
    "sourceRoot": "https://github.com/chameleonjp-lab/nusumidase/tree/c604c7990e5ba9a599898ede6c1ccb4b42970b51",
    "publicationEvidence": {
      "verified": false,
      "officialUrl": null,
      "candidateUrl": null,
      "deployedCommit": null,
      "checkedAt": "2026-10-05T03:49:58Z",
      "method": [
        "Official repository main, README and fixed source documents",
        "Public repository metadata: homepage null",
        "Repository has_pages false; this does not exclude unrecorded alternate hosts"
      ],
      "sources": [
        "https://github.com/chameleonjp-lab/nusumidase/blob/c604c7990e5ba9a599898ede6c1ccb4b42970b51/README.md",
        "https://github.com/chameleonjp-lab/nusumidase/blob/c604c7990e5ba9a599898ede6c1ccb4b42970b51/docs/REQUIREMENTS.md",
        "https://github.com/chameleonjp-lab/nusumidase/blob/c604c7990e5ba9a599898ede6c1ccb4b42970b51/docs/IMPLEMENTATION_PLAN.md",
        "https://github.com/chameleonjp-lab/nusumidase/pull/1"
      ],
      "unknown": [
        "No verified current playable deployment URL"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "mergedSpecification": {
        "pullRequest": 1,
        "mergeCommit": "c604c7990e5ba9a599898ede6c1ccb4b42970b51",
        "gameImplementationPresent": false
      }
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-05T03:53:32Z"
  }
];

/** Returns a verified fixed HTTPS URL, or null; API-supplied URLs are never used. */
export function getPlayableUrl(entry) {
  if (!entry || entry.releaseState !== 'published' || entry.publicationEvidence?.verified !== true) return null;
  const expected = Object.prototype.hasOwnProperty.call(OFFICIAL_PLAY_URLS, entry.id)
    ? OFFICIAL_PLAY_URLS[entry.id] : null;
  if (!expected || entry.playUrl !== expected || entry.publicationEvidence.officialUrl !== expected) return null;
  if (!/^[a-f0-9]{40}$/.test(entry.publicationEvidence.deployedCommit ?? '')) return null;
  const url = new URL(entry.playUrl);
  return url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash
    ? url.href : null;
}

/** Throws on an invalid catalog; suitable for build-time static HTML validation. */
export function validateCatalog(entries = catalog) {
  const ids = ['kaisen', 'faitofuraito', 'machimamore', 'gekichin', 'uchiotose', 'senryou', 'fantasia', 'nusumidase'];
  if (!Array.isArray(entries) || entries.length !== ids.length) throw new TypeError('Catalog must contain exactly eight games');
  entries.forEach((entry, index) => {
    const repo = `https://github.com/chameleonjp-lab/${ids[index]}`;
    if (entry.id !== ids[index] || entry.displayOrder !== index + 1) throw new TypeError('Invalid catalog order or game identifier');
    if (typeof entry.title !== 'string' || !entry.title.trim() || typeof entry.description !== 'string' || !entry.description.trim() || !/^[a-f0-9]{40}$/.test(entry.sourceCommit)) throw new TypeError('Missing catalog source or description');
    if (entry.repositoryUrl !== repo || entry.sourceRoot !== `${repo}/tree/${entry.sourceCommit}`) throw new TypeError('Invalid repository provenance');
    if (!['published', 'preparing', 'unverified'].includes(entry.releaseState)) throw new TypeError('Invalid publication state');
    if (entry.releaseState === 'published' ? !getPlayableUrl(entry) || getPlayableUrl(entry) !== entry.playUrl : entry.playUrl !== null) throw new TypeError('Unverified play URL');
    if (entry.ranking.enabled !== false || entry.ranking.displayState !== 'not_connected') throw new TypeError('Ranking activation requires separate verified authorization');
  });
  return true;
}

export default catalog;
