# 事前準備

- google 認証 と github 認証の client_secret は別管理
- 事前に terraform.tfvars を作って中身にシークレットキーを入れる

```terraform.tfvars
oauth_client_secret_google=""
oauth_client_secret_github=""
```

# コマンド

- staging 環境は以下のコマンドを叩くと更新する

```
terraform init
terraform apply
```

# 料金プラン

- Blaze プランにしないと google_identity_platform_config とか google_firebase_storage_bucket が失敗する
- 一旦 Blaze プランにして走らせた後に Spark プランに戻す。これだけなら今のところお金はかからない

# Authentication

- ユーザー アカウントのリンクがデフォルト「同じメールアドレスを使用するアカウントをリンク」だが、「ID プロバイダごとに複数のアカウントを作成」に変更されている。理由は分からない。
- ↑ の[設定](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/identity_platform_config)を変更する方法は分からず。。。

# Cloud Firestore

- ルールは変えたが影響は分からない。以前のルールは警告が出ていた
