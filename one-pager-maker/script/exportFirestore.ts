import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// サービスアカウントキーのパス
const serviceAccount = require('./serviceAccountKey.json');

// Firebase初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// データのエクスポート
async function exportFirestore() {
  const collections = await db.listCollections();
  const data: { [key: string]: any } = {};

  for (const collection of collections) {
    const snapshot = await collection.get();
    const docs: { [key: string]: any } = {};
    snapshot.forEach(doc => {
      docs[doc.id] = doc.data();
    });
    data[collection.id] = docs;
  }

  // データをJSONファイルに保存
  const outputPath = path.resolve(__dirname, 'firestoreExport.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log('データのエクスポートが完了しました。');
}

exportFirestore();
