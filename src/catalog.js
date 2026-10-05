// Fixed allowlist of the eight Zero Series titles. Publication evidence and
// source revision are separate: a repository implementation is not a release.
// Recheck docs/evidence/catalog.md before enabling a new URL or ranking scope.
const OFFICIAL_PLAY_URLS = Object.freeze({
  kaisen: 'https://chameleonjp-lab.github.io/kaisen/',
  faitofuraito: 'https://chameleonjp-lab.github.io/faitofuraito/',
  uchiotose: 'https://chameleonjp-lab.github.io/uchiotose/',
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
    "sourceCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
    "sourceRoot": "https://github.com/chameleonjp-lab/kaisen/tree/519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/kaisen/",
      "candidateUrl": null,
      "deployedCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
      "checkedAt": "2026-10-05T14:32:00Z",
      "method": [
        "TLS-verified public HTML, manifest and product assets; SHA-256 comparison",
        "Current main source and exact CI or fresh production build checked separately"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/kaisen/deployment.json",
        "https://github.com/chameleonjp-lab/kaisen/actions/runs/37300960802"
      ],
      "unknown": [
        "No new interactive browser or physical iPhone acceptance performed for this review"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "artifactHashes": {
        "assets/index-AnoDvxMm.js": "bc0e3bf86a54b5e673e7a7b0e5eafbb85bf6ad2f059eaab41c72d4d9430b8f3d",
        "assets/index-CC4z0vjG.css": "27a94f1a79f29ec460e9d2493989b05d0870874621a13186c397a5fe3e0c527a",
        "index.html": "864fac28e535f8022fd4edc4c14035b83e906460a60f9bb190e30da6f3ac0cff",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 37300960802,
        "headCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
        "conclusion": "success",
        "completedRecordAt": "2026-10-05T11:09:19Z"
      },
      "historicalHomeCheck": {
        "sourceCommit": "3d751051dc6212482a129e8da596ddd349b2f9f5",
        "checkedAt": "2026-10-05T03:52:34.410Z",
        "appliesToCurrentSource": false,
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
      }
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-05T14:32:00Z"
  },
  {
    "id": "faitofuraito",
    "displayOrder": 2,
    "title": "ファイトフライト",
    "description": "零戦二一型を題材に、操縦と射撃を楽しむ空戦ゲーム。時間無制限のノーマルと、5分間のイージーを選べます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/faitofuraito/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/faitofuraito",
    "sourceCommit": "9b1a54b6c24cf9fa0487ff3c2c6fe5324fb1ac5e",
    "sourceRoot": "https://github.com/chameleonjp-lab/faitofuraito/tree/9b1a54b6c24cf9fa0487ff3c2c6fe5324fb1ac5e",
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/faitofuraito/",
      "candidateUrl": null,
      "deployedCommit": "9b1a54b6c24cf9fa0487ff3c2c6fe5324fb1ac5e",
      "checkedAt": "2026-10-05T14:32:00Z",
      "method": [
        "TLS-verified public HTML, manifest and product assets; SHA-256 comparison",
        "Current main source and exact CI or fresh production build checked separately"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/faitofuraito/deployment.json",
        "https://github.com/chameleonjp-lab/faitofuraito/actions/runs/37293139866"
      ],
      "unknown": [
        "No new interactive browser or physical iPhone acceptance performed for this review"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "artifactHashes": {
        "third-party-notices.txt": "8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc",
        "ranking-manifest.json": "5f3a91f821ea3894ece70d6ee4f2978467df1b3d04692e1a4c943c953085de17",
        "social-card.png": "7a3fb68e0504a3a2ec31178325394cf62a793518f65833645e69661353db8989",
        "index.html": "4e6f88ed2543e3258fbb612ea835dffbf14d27f516eb54a725beff4a373f15fa",
        "assets/index-DWkc_rYZ.css": "279163e59993581a7adf69a62c5a97539a04d84186b03bc6ffe57ac0d0b7c7ca",
        "assets/index-H6N7oKHa.js": "9acb7790edc01366203002890d4d1029be099fffca90cd2d9644a62d1469c5c0",
        "deployment.json": "ee74115aba771d5885f24a0f2c60570e1bcd1a390b3916326632fd8a9ab06e15"
      },
      "deployedBranchCommit": "c0027e3d62bceafcc1cfb41bc95cff5a5b2fd8d8",
      "deploymentRecord": {
        "kind": "github_pages_branch",
        "runId": 37293139866,
        "headCommit": "c0027e3d62bceafcc1cfb41bc95cff5a5b2fd8d8",
        "conclusion": "success",
        "completedRecordAt": "2026-10-05T09:55:15Z"
      },
      "historicalHomeCheck": {
        "sourceCommit": "037e7914572871f18eb9aa9a41eca4fdae9f3bc7",
        "checkedAt": "2026-10-05T03:52:35.267Z",
        "appliesToCurrentSource": false,
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
      }
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
    "contentUpdatedAt": "2026-10-05T14:32:00Z"
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
    "description": "味方艦隊と戦闘機で、浮遊島から出撃する飛行戦士と戦う海上空戦ゲーム。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/uchiotose/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/uchiotose",
    "sourceCommit": "772812665b94c854f1834a759560bb07eb9e89bb",
    "sourceRoot": "https://github.com/chameleonjp-lab/uchiotose/tree/772812665b94c854f1834a759560bb07eb9e89bb",
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/uchiotose/",
      "candidateUrl": null,
      "deployedCommit": "aac2b36e651024bc3ccca851e2374f5dd373a3b1",
      "checkedAt": "2026-10-05T14:32:00Z",
      "method": [
        "TLS-verified public HTML, manifest and product assets; SHA-256 comparison",
        "Current main source and exact CI or fresh production build checked separately"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/uchiotose/release.json",
        "https://github.com/chameleonjp-lab/uchiotose/tree/772812665b94c854f1834a759560bb07eb9e89bb",
        "https://github.com/chameleonjp-lab/uchiotose/tree/391ac84cb5fb68cae2aa1332b5b978e6a87cb1bb"
      ],
      "unknown": [
        "No new interactive browser or physical iPhone acceptance performed for this review",
        "Release manifest names an earlier source commit; current main product bytes match, but newer documents are not presented as a new game deployment",
        "Alternate Sites asset requests returned 403 and were not retried or bypassed",
        "Long-gap pause fix in PR #8 is not merged or deployed"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "artifactHashes": {
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f",
        "index.html": "1e81cd9af73688d75542af13e28e4a46e0f4441d0f6b7b1f01cd8a924bef0230",
        "assets/index-jjlx_KNJ.css": "2dfeffc8772c95dc1673934db5bf8048ddde79d6e3a541dbf81dcaf3b36d1382",
        "assets/index-9zuTiUNp.js": "10e11722468205f51a1691405019d3ae588022f8337642027de747c739973e0a"
      },
      "deployedBranchCommit": "391ac84cb5fb68cae2aa1332b5b978e6a87cb1bb",
      "currentMainProductBytesMatch": true,
      "unpublishedReviewFix": "https://github.com/chameleonjp-lab/uchiotose/pull/8"
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-05T14:32:00Z"
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
