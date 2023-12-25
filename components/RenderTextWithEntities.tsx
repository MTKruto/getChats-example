import { ComponentChildren } from "preact";
import { MessageEntity } from "mtkruto/3_types.ts";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { peerColors } from "../peer_colors.ts";
import { CustomEmoji } from "./CustomEmoji.tsx";

export function RenderTextWithEntities(
  { color, children: text, entities }: {
    color: number;
    children: string;
    entities: MessageEntity[];
  },
) {
  const allEmoji =
    /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/
      .test(text);
  const normalEmojiSize = entities.some((v) => v.type == "blockquote");
  const length = [...text].length;
  const emojiSize = normalEmojiSize
    ? 20
    : allEmoji
    ? length == 1 ? 100 : length <= 3 ? 55 : 30
    : 20;
  return renderImpl(
    text,
    entities,
    undefined,
    undefined,
    undefined,
    color,
    emojiSize,
  )[0];
}

// TODO: add tests
function renderImpl(
  text: string,
  entities: MessageEntity[],
  length = 0,
  processedEntities = new Set<MessageEntity>(),
  components = new Array<ComponentChildren>(),
  color: number,
  emojiSize: number,
) {
  for (const entity of entities) {
    if (processedEntities.has(entity)) {
      continue;
    }
    if (length < entity.offset) {
      const toPush = text.slice(length, entity.offset);
      components.push(toPush);
      length += toPush.length;
    }
    const nestedEntities = getNestedEntities(entity, entities);
    const toPushText = text.slice(length, length + entity.length);
    if (!nestedEntities.length) {
      const toPush = renderEntity(
        entity,
        toPushText,
        toPushText,
        color,
        emojiSize,
      );
      components.push(toPush);
      length += toPushText.length;
    } else {
      const [content, toPushLength] = renderImpl(
        toPushText,
        nestedEntities,
        0,
        processedEntities,
        undefined,
        color,
        emojiSize,
      );
      const toPush = renderEntity(
        entity,
        content,
        toPushText,
        color,
        emojiSize,
      );
      components.push(toPush);
      length += toPushLength;
    }
    processedEntities.add(entity);
  }
  if (length < text.length) {
    const toPush = text.slice(length);
    components.push(toPush);
    length += toPush.length;
  }
  return [<>{components.reduce((a, b) => <>{a}{b}</>)}</>, length] as const;
}

function getNestedEntities(entity: MessageEntity, entities: MessageEntity[]) {
  const nestedEntites = new Array<MessageEntity>();
  const endOffset = entity.offset + entity.length;
  for (const entity_ of entities) {
    if (entity_ == entity) {
      continue;
    }
    if (entity_.offset >= entity.offset && entity_.offset < endOffset) {
      nestedEntites.push(entity_);
    }
  }
  return nestedEntites;
}

const classes = {
  botCommand: "text-blue-400",
  "*tag": "text-blue-400",
  link: "text-blue-400 cursor-pointer",
};
function renderEntity(
  entity: MessageEntity,
  content: ComponentChildren,
  text: string,
  color: number,
  emojiSize: number,
) {
  switch (entity.type) {
    case "mention":
      return <span class={classes.link}>{content}</span>;
    case "hashtag":
      return <span class={classes["*tag"]}>{content}</span>;
    case "botCommand":
      return <span class={classes.botCommand}>{content}</span>;
    case "url":
      return (
        <a class={classes.link} href={text} rel="noreferrer noopener">
          {content}
        </a>
      );
    case "email":
      return (
        <a
          class={classes.link}
          href={`mailto:${text}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      );
    case "bold":
      return <span class="font-bold">{content}</span>;
    case "italic":
      return <span class="italic">{content}</span>;
    case "code":
      return <code class="font-mono">{content}</code>;
    case "pre":
      return <pre class={`language-${entity.language}`}>{content}</pre>;
    case "textLink":
      return (
        <a
          class={classes.link}
          href={entity.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      );
    case "textMention":
      return <span class="mention">{content}</span>;
    case "cashtag":
      return <span class="cashtag">{content}</span>;
    case "phoneNumber":
      return <span>{content}</span>;
    case "underline":
      return <span class="underline">{content}</span>;
    case "strikethrough":
      return <span class="line-through">{content}</span>;
    case "blockquote":
      return <Blockquote color={color}>{content}</Blockquote>;
    case "bankCard":
      return <span>{content}</span>;
    case "spoiler":
      return <Spoiler>{content}</Spoiler>;
    case "customEmoji":
      return (
        <CustomEmoji size={emojiSize} replacement={content}>
          {entity}
        </CustomEmoji>
      );
  }
}

function Blockquote(
  { children, color }: {
    children?: ComponentChildren;
    color: number;
  },
) {
  const colors = peerColors[color] ?? ["#fff"];
  const first = colors[0];
  const second = colors[1];
  const third = colors[2];
  const background = colors.length == 2
    ? `repeating-linear-gradient(-45deg, ${first}, ${first} 10px, ${second} 10px, ${second} 20px)`
    : colors.length == 3
    ? `repeating-linear-gradient(-45deg, ${first}, ${first} 10px, ${second} 10px, ${second} 20px, ${third} 20px, ${third} 30px)`
    : undefined;
  return (
    <div class="relative pl-4 pr-3 py-3 flex rounded-lg overflow-hidden bg-bg2">
      <div
        class={`w-1 absolute left-0 top-0 h-full rounded-l-sm ${
          background === undefined ? `bg-[${first}]` : ""
        }`}
        style={{
          background,
        }}
      >
      </div>
      {children}
    </div>
  );
}

function Spoiler(
  { children }: {
    children?: ComponentChildren;
  },
) {
  const open = useSignal(false);

  useEffect(() => {
    if (open.value) {
      const timeout = setTimeout(() => {
        open.value = false;
      }, 20_000);
      return () => clearTimeout(timeout);
    }
  }, [open.value]);

  return (
    <span
      class={`inline-block overflow-hidden ${open.value ? "" : "rounded-md"}`}
      onClick={() => {
        if (!open.value) {
          open.value = true;
        }
      }}
    >
      <span
        class={`duration-200 ${open.value ? "" : "blur-sm"}`}
      >
        <span>
          {children}
        </span>
      </span>
    </span>
  );
}
