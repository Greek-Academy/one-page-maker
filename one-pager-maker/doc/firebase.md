# Cloud Firestore バックアップについて
- [データのバックアップと復元](https://firebase.google.com/docs/firestore/backups?hl=ja)でバックアップを取ることが出来る。但し、無料版では出来ない。
- [データのエクスポートとインポート](https://firebase.google.com/docs/firestore/manage-data/export-import?hl=ja#gcloud_3)も無料版では出来ない。
- [サーバーに Firebase Admin SDK を追加する](https://firebase.google.com/docs/admin/setup?hl=ja)で、無料版でインポートとエクスポートは可能かも。
- 但し、プロジェクトの設定でオーナー以外「サービス アカウント」タブがないためserviceAccountKey.jsonを出力出来ないためSDKも使えない。


