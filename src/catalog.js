// Fixed allowlist of the eight Zero Series titles. Publication evidence and
// source revision are separate: a repository implementation is not a release.
// Recheck docs/evidence/catalog.md before enabling a new URL or ranking scope.
const OFFICIAL_PLAY_URLS = Object.freeze({
  kaisen: 'https://chameleonjp-lab.github.io/kaisen/',
  faitofuraito: 'https://chameleonjp-lab.github.io/faitofuraito/',
  machimamore: 'https://chameleonjp-lab.github.io/machimamore/',
  gekichin: 'https://chameleonjp-lab.github.io/gekichin/',
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
    "description": "街20区画を守り、味方戦闘機と50機の敵UFOを迎撃する都市防衛ゲーム。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/machimamore/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/machimamore",
    "sourceCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
    "sourceRoot": "https://github.com/chameleonjp-lab/machimamore/tree/1d27a697ea62dbfa676e1e78968c164552459ec5",
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/machimamore/",
      "candidateUrl": null,
      "deployedCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
      "checkedAt": "2026-10-06T00:41:12.108Z",
      "method": [
        "TLS-verified public HTML, JS, CSS, NOTICE and artifact manifest; exact bytes and SHA-256 comparison with an independent main build",
        "All six public files including deployment.json match the actual Pages artifact; 81 source inputs independently verified against the CI source manifest",
        "Successful GitHub Actions verification and Pages deployment for the same source commit",
        "Live cloud-browser home and graphics-failure screen pixels inspected; gameplay blocked by disabled cloud WebGL"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/machimamore/deployment.json",
        "https://chameleonjp-lab.github.io/machimamore/artifact-manifest.json",
        "https://github.com/chameleonjp-lab/machimamore/actions/runs/37394426765",
        "https://github.com/chameleonjp-lab/machimamore/blob/1d27a697ea62dbfa676e1e78968c164552459ec5/README.md",
        "https://github.com/chameleonjp-lab/machimamore/blob/1d27a697ea62dbfa676e1e78968c164552459ec5/docs/IMPLEMENTATION_STATUS.md"
      ],
      "unknown": [
        "Cloud WebGL was disabled; live gameplay was not verified",
        "Physical iPhone and human gameplay, performance and audio acceptance were not performed",
        "The speed-lever UI, v2 settings migration and acceptance tests remain pending integration"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "artifactHashes": {
        "artifact-manifest.json": "57742db53f439b2641c8c4b6f8eab3cf3264d9217cce217002531d58f3111589",
        "assets/index-BAyulP5k.css": "52bee58f42cf2b7d73afc93ba89df8a27f15cd117f74a857c8d852c602516d65",
        "assets/index-CX-kywWz.js": "9d04640ab8527e2b90fae88da3a455d7ca1da658eb0b20d21da04e1202dcceb0",
        "index.html": "dae5e25fd272dcf1115e7af756565e940271db243102c5af9a4f2ab6a0947d79",
        "third-party-notices.txt": "8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc"
      },
      "manifestSha256": "ab92295564225afb5fe84a8b4c9596f3537ed3efdf5df43cd309e0d3d8626d8a",
      "sourceContentDigest": "f5cf45e8fc5907fcd8113596c8fb14d6d1e461e34f428547ae5fb9610bd41043",
      "sourceManifestSha256": "c9ef9cd15a779cf1e0a5715ef39d39e3efdc367d8f12f5d07857ac4d8831725b",
      "currentMainProductBytesMatch": true,
      "deployedArtifactBytesMatch": true,
      "deploymentManifestMatchesIndependentBuild": false,
      "manifestVariance": "The CI and independent source manifests differ only in generatedAt, so deployment.json differs only in sourceManifestSha256; all 81 source inputs and sourceContentDigest match",
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 37394426765,
        "headCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
        "conclusion": "success",
        "completedRecordAt": "2026-10-06T00:37:50Z"
      }
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-06T00:50:00Z"
  },
  {
    "id": "gekichin",
    "displayOrder": 4,
    "title": "ゲキチン",
    "description": "超大型母艦の100基の砲台を、僚機と破壊するタイム・スコアアタック。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/gekichin/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/gekichin",
    "sourceCommit": "5504f3785ca783a694b2c5fedd39987ad6ef4349",
    "sourceRoot": "https://github.com/chameleonjp-lab/gekichin/tree/5504f3785ca783a694b2c5fedd39987ad6ef4349",
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/gekichin/",
      "candidateUrl": null,
      "deployedCommit": "5504f3785ca783a694b2c5fedd39987ad6ef4349",
      "checkedAt": "2026-10-06T08:43:14.434063Z",
      "method": [
        "TLS-verified public deployment manifest and four product files; exact bytes and SHA-256 comparison with the Pages artifact",
        "Successful GitHub Actions verification and Pages deployment for the same source commit",
        "All four product files are byte-identical to the previous release; only the deployment manifest changed",
        "The earlier cloud-browser home check did not verify gameplay because cloud WebGL was disabled; no new device acceptance is claimed"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/gekichin/deployment.json",
        "https://github.com/chameleonjp-lab/gekichin/actions/runs/37436127535",
        "https://github.com/chameleonjp-lab/gekichin/blob/5504f3785ca783a694b2c5fedd39987ad6ef4349/src/main.ts",
        "https://github.com/chameleonjp-lab/gekichin/blob/5504f3785ca783a694b2c5fedd39987ad6ef4349/docs/IMPLEMENTATION_STATUS.md"
      ],
      "unknown": [
        "Cloud WebGL was disabled; the start control was disabled and live gameplay was not verified",
        "Physical iPhone and human gameplay, performance and audio acceptance were not performed"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "artifactHashes": {
        "assets/index-BufJBCcE.css": "d89927dcc6ca023fc4eb27a7d824215101184aeac9f2505e117eb80b76bb89bf",
        "assets/index-Ca9XU86d.js": "75a38d906ca0775e2a1b7322366f3dfeb97a00edfd817ca00efc6f356f34cb9c",
        "index.html": "1856e5b784410ffd8af94e7c8610f9def8ed0bc3f157062c28a7dd80c9b09b6a",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "manifestSha256": "bc0bcd6507275a37244084cfb63d37a4de4427db6d0e21f9e805fb10703d640c",
      "currentMainProductBytesMatch": true,
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 37436127535,
        "headCommit": "5504f3785ca783a694b2c5fedd39987ad6ef4349",
        "conclusion": "success",
        "completedRecordAt": "2026-10-06T08:40:38Z"
      },
      "deployedArtifactBytesMatch": true
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-06T09:26:30Z"
  },
  {
    "id": "uchiotose",
    "displayOrder": 5,
    "title": "ウチオトセ",
    "description": "味方艦隊と戦闘機で、浮遊島から出撃する飛行戦士と戦う海上空戦ゲーム。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/uchiotose/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/uchiotose",
    "sourceCommit": "2a7e815c70baf9dc65721fc938909b6ab083f074",
    "sourceRoot": "https://github.com/chameleonjp-lab/uchiotose/tree/2a7e815c70baf9dc65721fc938909b6ab083f074",
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/uchiotose/",
      "candidateUrl": null,
      "deployedCommit": "2a7e815c70baf9dc65721fc938909b6ab083f074",
      "checkedAt": "2026-10-06T08:55:57.349612Z",
      "method": [
        "TLS-verified public HTML, JS, CSS, release manifest, NOTICE and .nojekyll; all six files HTTP 200 and byte-identical to the publication package prepared from the verified main build",
        "Successful GitHub Pages deployment is bound to the gh-pages branch commit; release.json identifies the separate source commit",
        "Merged PR #8 fixed-clock long-gap pause correction is included in this release; PR #9 adds acceptance coverage without changing game runtime",
        "Live cloud-browser home, rules and settings navigation checked; gameplay blocked by unavailable cloud WebGL"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/uchiotose/release.json",
        "https://github.com/chameleonjp-lab/uchiotose/tree/2a7e815c70baf9dc65721fc938909b6ab083f074",
        "https://github.com/chameleonjp-lab/uchiotose/tree/1307117008dc72f9031a8c345b6ac077fc8ff30b",
        "https://github.com/chameleonjp-lab/uchiotose/actions/runs/37439104263",
        "https://github.com/chameleonjp-lab/uchiotose/pull/8",
        "https://github.com/chameleonjp-lab/uchiotose/pull/9#issuecomment-6012752273"
      ],
      "unknown": [
        "Cloud WebGL was unavailable before and after release; the start control was disabled and live gameplay was not verified",
        "WebKit acceptance covers the settings fixture, not full game rendering",
        "Physical iPhone Safari and mobile GPU performance remain unverified"
      ],
      "evidenceFile": "docs/evidence/catalog.md",
      "artifactHashes": {
        ".nojekyll": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "assets/index-6rKQhKs9.js": "43c37845c5c40f00a614d813d5f68dad97d5d73ef46161725494bd19702cc639",
        "assets/index-jjlx_KNJ.css": "2dfeffc8772c95dc1673934db5bf8048ddde79d6e3a541dbf81dcaf3b36d1382",
        "index.html": "57062efb52f8ce0a2f3784b0a5f3de25a309c28b85061749b39501a5622b9b3e",
        "release.json": "912aa5163fc46ab06aa80387c475ca1abef960c72f27ef0a49f43a3fc4180cb7",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "deployedBranchCommit": "1307117008dc72f9031a8c345b6ac077fc8ff30b",
      "currentMainProductBytesMatch": true,
      "deployedArtifactBytesMatch": true,
      "manifestSha256": "912aa5163fc46ab06aa80387c475ca1abef960c72f27ef0a49f43a3fc4180cb7",
      "releaseManifest": {
        "commit": "2a7e815c70baf9dc65721fc938909b6ab083f074",
        "rulesVersion": "uchiotose-1",
        "ranking": false
      },
      "deploymentRecord": {
        "kind": "github_pages_branch",
        "runId": 37439104263,
        "headCommit": "1307117008dc72f9031a8c345b6ac077fc8ff30b",
        "conclusion": "success",
        "completedRecordAt": "2026-10-06T08:53:21Z"
      },
      "publishedReviewFix": "https://github.com/chameleonjp-lab/uchiotose/pull/8"
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-06T09:26:30Z"
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
