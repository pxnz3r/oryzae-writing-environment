import type { RefObject } from 'react';

interface EssayArticleProps {
  manuscriptRef: RefObject<HTMLElement | null>;
}

/** The main essay content with inline spore words that act as mycelium targets */
export default function EssayArticle({ manuscriptRef }: EssayArticleProps) {
  return (
    <article
      ref={manuscriptRef}
      className="col-start-3 text-[1.15rem] text-[#4a4242] fade-in"
      style={{ animationDelay: '0.4s' }}
    >
      <div className="font-sans text-[0.85rem] text-text-meta mb-[4rem] flex gap-[24px] border-b border-hairline pb-[24px]">
        <span>思考のエッセイ</span>
        <span>2023年10月</span>
        <span>読了時間: 4分</span>
      </div>

      <h1 className="text-[4.5rem] font-medium mb-[2rem] tracking-[-0.02em] leading-[1.2] text-[#2d2626] max-lg:text-[3rem]">
        発酵する思考
      </h1>

      <p className="mb-[2.5rem] text-justify">
        思考とは、真空の中で生まれるものではない。それは<span className="spore">土壌</span>のようなものだ。無数の断片的な記憶、感情、そして外部からの刺激が混ざり合い、静かな時間をかけて変質していくプロセスである。私たちは即時的な答えを求めがちだが、真の理解は、まるで微生物が有機物を分解するように、ゆっくりとした<span className="spore">発酵</span>を経て初めて醸成される。
      </p>

      <p className="mb-[2.5rem] text-justify">
        「待つ」という行為は、現代において最も贅沢で、かつ困難な技術となった。スマートフォンを開けば数秒で答えが見つかる世界において、未解決の<span className="spore">問い</span>を抱え続けることは苦痛を伴う。しかし、答えが出ない空白の時間こそが、思考の菌糸が伸びるための不可欠な余白なのだ。
      </p>

      <p className="mb-[2.5rem] text-justify">
        日本酒造りにおいて、杜氏は麹菌の機謙を伺い、温度や湿度を微細に調整する。彼らは菌をコントロールするのではなく、菌が<span className="spore">活動</span>しやすい環境を整えるに過ぎない。私たちの創造性も同様ではないだろうか。新しいアイデアを無理やり絞り出すのではなく、自分自身の内面を整え、偶然のひらめきが降りてくるのを<span className="spore">待つ</span>姿勢。それが「発酵する思考」の正体である。
      </p>

      <p className="mb-[2.5rem] text-justify">
        腐敗と発酵の違いは、人間にとって有益か否かという主観的な境界線に過ぎない。失敗や挫折といったネガティブな経験も、適切な環境と時間さえあれば、人生を味わい深くする<span className="spore">旨味</span>へと変化しうる。重要なのは、そのプロセスを急がないことだ。焦燥感は、繊細な菌の働きを阻害する雑菌のようなものである。
      </p>

      <p className="mb-[2.5rem] text-justify">
        静寂の中に身を置き、自分の内なる声に耳を傾けるとき、思考は個人の枠を超えて<span className="spore">広がる</span>。それはまるで、森の地下に広がるマイセリウム（菌糸体）のネットワークのように、見えないところで他者や世界と繋がっているのかもしれない。私たちが「自分の考え」だと思っているものは、実は長い歴史の中で受け継がれてきた知恵の<span className="spore">胞子</span>が、たまたま私という個体に着床し、芽吹いた結果に過ぎないのだから。
      </p>

      <p className="mb-[2.5rem] text-justify">
        だからこそ、私たちは問い続けなければならない。目に見える成果や数字だけを追い求めるのではなく、目に見えない<span className="spore">プロセス</span>にこそ価値を見出すこと。それが、この加速する世界で人間性を保ち続けるための、唯一の抵抗手段なのかもしれない。
      </p>
    </article>
  );
}
