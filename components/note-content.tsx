"use client";

import { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Note } from "@/lib/types";

export default function NoteContent({ note }: { note: Note }) {

  const renderListItem = useCallback(({ children, ...props }: any) => {
    if (!props.className?.includes('task-list-item')) return <li {...props}>{children}</li>;

    const checkbox = children.find((child: any) => child.type === 'input');
    if (!checkbox) return <li {...props}>{children}</li>;

    const isChecked = checkbox.props.checked;
    const taskContent = children.filter((child: any) => child !== checkbox);
    const taskText = taskContent.map((child: any) => {
      if (typeof child === 'string') return child;
      if (child.type === 'a') return `[${child.props.children}](${child.props.href})`;
      return child.props.children;
    }).join('').trim();

    const taskId = `task-${taskText.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}-${props.index}`;

    return (
      <li {...props}>
        <span className="flex items-start">
          <span className="cursor-default mr-1">
            <input
              type="checkbox"
              checked={isChecked}
              className="pointer-events-none"
              id={taskId}
              readOnly
            />
          </span>
          <span>{taskContent}</span>
        </span>
      </li>
    );
  }, []);

  const renderLink = useCallback((props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a {...props} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    );
  }, []);

  return (
    <div className="px-2">
      <div className="h-full text-sm">
        <ReactMarkdown
          className="markdown-body min-h-dvh"
          remarkPlugins={[remarkGfm]}
          components={{
            li: renderListItem,
            a: renderLink,
          }}
        >
          {note.content || "No content available"}
        </ReactMarkdown>
      </div>
    </div>
  );
}