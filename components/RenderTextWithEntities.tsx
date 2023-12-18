import { ComponentChildren } from "preact";
import { MessageEntity } from "mtkruto/3_types.ts";

export function RenderTextWithEntities(
  { children: text, entities }: { children: string; entities: MessageEntity[] },
) {
  return renderImpl(text, entities)[0];
}

// TODO: add tests
function renderImpl(
  text: string,
  entities: MessageEntity[],
  length = 0,
  processedEntities = new Set<MessageEntity>(),
  components = new Array<ComponentChildren>(),
) {
  for (const entity of entities) {
    if (processedEntities.has(entity)) {
      continue;
    }
    if (length < entity.offset) {
      const toPush = text.slice(0, entity.offset);
      components.push(toPush);
      length += toPush.length;
    }
    const nestedEntities = getNestedEntities(entity, entities);
    const toPushText = text.slice(length, length + entity.length);
    if (!nestedEntities.length) {
      const toPush = renderEntity(entity, toPushText, toPushText);
      components.push(toPush);
      length += toPushText.length;
    } else {
      const [content, toPushLength] = renderImpl(
        toPushText,
        nestedEntities,
        0,
        processedEntities,
      );
      const toPush = renderEntity(entity, content, toPushText);
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

function renderEntity(
  entity: MessageEntity,
  content: ComponentChildren,
  text: string,
) {
  switch (entity.type) {
    case "mention":
      return <span class="mention">{content}</span>;
    case "hashtag":
      return <span class="hashtag">{content}</span>;
    case "botCommand":
      return <span class="bot-command">{content}</span>;
    case "url":
      return <a href={text} rel="noreferrer noopener">{content}</a>;
    case "email":
      return (
        <a href={`mailto:${text}`} target="_blank" rel="noreferrer noopener">
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
          class="link"
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
      return <span class="strike">{content}</span>;
    case "blockquote":
      return <span class="blockquote">{content}</span>;
    case "bankCard":
      return <span>{content}</span>;
    case "spoiler":
      return <span>{content}</span>;
    case "customEmoji":
      return <span>{content}</span>;
  }
}
