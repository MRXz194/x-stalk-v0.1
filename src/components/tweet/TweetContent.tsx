interface TweetContentProps {
  content: string;
  linkInText: string | null;
}

export default function TweetContent({
  content,
  linkInText,
}: TweetContentProps) {
  return (
    <>
      {content.split("\n").map((line, i) => (
        <span key={i}>
          {line.trim()}
          {i < content.split("\n").length - 1 && <br />}
        </span>
      ))}
      {linkInText && (
        <a
          href={linkInText}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-1 text-blue-500 hover:text-blue-600 hover:underline"
        >
          {linkInText}
        </a>
      )}
    </>
  );
}
