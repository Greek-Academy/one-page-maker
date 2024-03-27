![actions](https://github.com/Greek-Academy/one-pager-maker/actions/workflows/deploy-production.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/0f4d9c3b8a049eccdb62/maintainability)](https://codeclimate.com/github/Greek-Academy/one-pager-maker/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0f4d9c3b8a049eccdb62/test_coverage)](https://codeclimate.com/github/Greek-Academy/one-pager-maker/test_coverage)

# 1PagerMaker
There is a concept called 1Pager. As the name suggests, it is a text that summarizes the main points in one page. Generally speaking, I don't want to read long texts. The idea of creating a text that summarizes only the necessary information on one page is simple and very good.
At Google, it seems that when considering specifications, they first create 1Pager. In that case, there are several formats. Write the status, reviewer, date and time of update, etc. first. There are also headings such as summary and background.
The format may be created by copying and pasting, but if you have decided on a format, it is easier to write on a platform that has been prepared from the beginning. It would also be useful to be able to use highlighting and links within the text.
So I decided to create a service that allows you to easily write 1Pager and use Markdown. That is this 1PagerMaker.

# Hierarchical
I heard that Google creates a design document as a place to write more detailed content after coming up with specifications using 1Pager.
I thought the concept of 1Pager and design document, which is simple and allows you to write detailed texts, was very good, but I thought it was a shame to hear that 1Pager was disposable once it was first created.
In many cases, a simple one-page text can be useful even after creating a detailed document. Depending on the situation, one page of simple text may be more appropriate than 10 pages of detailed text.
In other words, I thought it would be better if these two were correlated. However, these two have a master and slave; 1Pager is the master and the design document is the slave.
In that case, I thought that in terms of UI/UX, if there was a mechanism to create 1Pager hierarchically, this would be achieved, and the expressiveness would be enhanced in other ways.
Therefore, I decided to create 1PagerMaker as a hierarchical 1PagerMaker.

----

# 1PagerMaker
1Pagerという考え方がある。その名の通り、ポイントだけを1枚でまとめた文章だ。大体において長ったらしい文章は読みたくない。必要なことだけを1ページにまとめた文章を作るという考え方はシンプルで非常に良い。
Googleでは、まず仕様を考える時は1Pagerを作るらしい。その場合にフォーマットが幾つかある。ステータスやレビュアー、更新日時などを最初に書く。またサマリーや背景などの見出しがある。
フォーマットは、コピペで作ることもあるが、決まっているのであれば最初から用意されたプラットフォームがあればそちらで書く方が手軽だ。また、文章の中に強調表示やリンクが使えると便利だ。
そこで1Pagerを手軽に書けてマークダウンが使えるサービスを作ることにした。それがこの1PagerMakerだ。

# 階層式
Googleでは1Pagerで仕様を考えた後に、さらに詳細な内容を書く場所としてデザインドキュメントを作るという話を聞いた。
1Pagerとデザインドキュメントというシンプルと詳細な文章を書くという考え方はとても良いと思ったが、1Pagerは最初に作ったら使い捨てるという話を聞いて残念だと思った。
シンプルな1ページにまとまった文章は詳細ドキュメントを作った後でも便利に使えるケースは多い。10ページの詳細な文章より1ページな簡易な文章の方が状況によっては適切に伝えらえることもある。
つまりこの2つは相関関係になっている方が望ましいと思った。ただし、この2つは主従があり、1Pagerが主でありデザインドキュメントが従だ。
そうなるとUI/UX的には1Pagerを階層的に作れる仕組みがあれば、それが叶えられ、それ以外にも表現力が高くなると思った。
そこで1PagerMakerは階層式1PagerMakerとして作ることにした。

