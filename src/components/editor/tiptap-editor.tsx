"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { common, createLowlight } from "lowlight";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    ListTodo,
    Quote,
    Minus,
    Undo,
    Redo,
    Link as LinkIcon,
    ImageIcon,
    Code2,
    Pilcrow,
    Highlighter,
    SuperscriptIcon,
    SubscriptIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    ChevronDown,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCallback, useState, useRef, useEffect } from "react";

const lowlight = createLowlight(common);

const CODE_LANGUAGES = [
    { value: "", label: "Auto" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "scss", label: "SCSS" },
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "xml", label: "XML" },
    { value: "markdown", label: "Markdown" },
    { value: "sql", label: "SQL" },
    { value: "bash", label: "Bash" },
    { value: "shell", label: "Shell" },
    { value: "dockerfile", label: "Dockerfile" },
    { value: "graphql", label: "GraphQL" },
    { value: "lua", label: "Lua" },
    { value: "r", label: "R" },
    { value: "perl", label: "Perl" },
    { value: "scala", label: "Scala" },
    { value: "dart", label: "Dart" },
];

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    tooltip: string;
    children: React.ReactNode;
}

function ToolbarButton({
    onClick,
    isActive,
    disabled,
    tooltip,
    children,
}: ToolbarButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    disabled={disabled}
                    className={cn(
                        "h-8 w-8 transition-colors",
                        isActive
                            ? "bg-ctp-mauve/15 text-ctp-mauve"
                            : "text-muted-foreground hover:text-foreground hover:bg-ctp-surface0",
                    )}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
}

interface DropdownItem {
    label: string;
    icon?: React.ReactNode;
    action: () => void;
    isActive?: boolean;
}

function ToolbarDropdown({
    label,
    icon,
    items,
    activeLabel,
}: {
    label: string;
    icon?: React.ReactNode;
    items: DropdownItem[];
    activeLabel?: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(!open)}
                        className={cn(
                            "h-8 gap-1 px-2 text-xs font-medium transition-colors",
                            items.some((i) => i.isActive)
                                ? "text-ctp-mauve"
                                : "text-muted-foreground hover:text-foreground hover:bg-ctp-surface0",
                        )}
                    >
                        {icon}
                        <span className="hidden sm:inline max-w-15 truncate">
                            {activeLabel || label}
                        </span>
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                    {label}
                </TooltipContent>
            </Tooltip>
            {open && (
                <div className="absolute top-full left-0 mt-1 z-50 min-w-37.5 rounded-lg border border-border/50 bg-ctp-mantle shadow-lg p-1">
                    {items.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                                item.action();
                                setOpen(false);
                            }}
                            className={cn(
                                "flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded-md transition-colors text-left",
                                item.isActive
                                    ? "bg-ctp-mauve/15 text-ctp-mauve"
                                    : "text-muted-foreground hover:text-foreground hover:bg-ctp-surface0",
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function TiptapEditor({
    content,
    onChange,
    placeholder = "Start writing your blog post...",
    className,
}: TiptapEditorProps) {
    // Force re-render counter for toolbar active state sync
    const [, setTick] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: {
                    levels: [1, 2, 3, 4],
                },
            }),
            Underline,
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-ctp-blue underline underline-offset-2 hover:text-ctp-sapphire cursor-pointer",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full my-4",
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: "is-editor-empty",
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: "bg-ctp-mantle rounded-lg p-4 overflow-x-auto my-4 font-code text-sm",
                },
            }),
            Highlight.configure({
                HTMLAttributes: {
                    class: "bg-ctp-yellow/30 rounded px-0.5",
                },
            }),
            Superscript,
            Subscript,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: "not-prose",
                },
            }),
            TaskItem.configure({
                nested: true,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: cn(
                    "tiptap blog-content outline-none min-h-100 p-4 focus:outline-none",
                    className,
                ),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        // Force toolbar re-render on every transaction (selection changes, typing, etc.)
        onTransaction: () => {
            setTick((t) => t + 1);
        },
        immediatelyRender: false,
    });

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("Enter URL:", previousUrl);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = window.prompt("Enter image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return (
            <div className="bg-ctp-surface0 border border-border/50 rounded-lg min-h-100 animate-pulse" />
        );
    }

    const isInCodeBlock = editor.isActive("codeBlock");
    const currentLanguage = editor.getAttributes("codeBlock")?.language || "";

    // Determine active heading label
    const getActiveHeadingLabel = () => {
        for (const level of [1, 2, 3, 4] as const) {
            if (editor.isActive("heading", { level })) return `H${level}`;
        }
        return "Paragraph";
    };

    // Determine active list label
    const getActiveListLabel = () => {
        if (editor.isActive("bulletList")) return "Bullet";
        if (editor.isActive("orderedList")) return "Ordered";
        if (editor.isActive("taskList")) return "Task";
        return "Lists";
    };

    const headingItems: DropdownItem[] = [
        {
            label: "Paragraph",
            icon: <Pilcrow className="h-3.5 w-3.5" />,
            action: () => editor.chain().focus().setParagraph().run(),
            isActive:
                editor.isActive("paragraph") && !editor.isActive("heading"),
        },
        {
            label: "Heading 1",
            icon: <Heading1 className="h-3.5 w-3.5" />,
            action: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive("heading", { level: 1 }),
        },
        {
            label: "Heading 2",
            icon: <Heading2 className="h-3.5 w-3.5" />,
            action: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive("heading", { level: 2 }),
        },
        {
            label: "Heading 3",
            icon: <Heading3 className="h-3.5 w-3.5" />,
            action: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive("heading", { level: 3 }),
        },
        {
            label: "Heading 4",
            icon: <Heading4 className="h-3.5 w-3.5" />,
            action: () =>
                editor.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: editor.isActive("heading", { level: 4 }),
        },
    ];

    const listItems: DropdownItem[] = [
        {
            label: "Bullet List",
            icon: <List className="h-3.5 w-3.5" />,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive("bulletList"),
        },
        {
            label: "Ordered List",
            icon: <ListOrdered className="h-3.5 w-3.5" />,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive("orderedList"),
        },
        {
            label: "Task List",
            icon: <ListTodo className="h-3.5 w-3.5" />,
            action: () => editor.chain().focus().toggleTaskList().run(),
            isActive: editor.isActive("taskList"),
        },
    ];

    const alignItems: DropdownItem[] = [
        {
            label: "Align Left",
            icon: <AlignLeft className="h-3.5 w-3.5" />,
            action: () => editor.chain().focus().setTextAlign("left").run(),
            isActive: editor.isActive({ textAlign: "left" }),
        },
        {
            label: "Align Center",
            icon: <AlignCenter className="h-3.5 w-3.5" />,
            action: () => editor.chain().focus().setTextAlign("center").run(),
            isActive: editor.isActive({ textAlign: "center" }),
        },
        {
            label: "Align Right",
            icon: <AlignRight className="h-3.5 w-3.5" />,
            action: () => editor.chain().focus().setTextAlign("right").run(),
            isActive: editor.isActive({ textAlign: "right" }),
        },
        {
            label: "Justify",
            icon: <AlignJustify className="h-3.5 w-3.5" />,
            action: () => editor.chain().focus().setTextAlign("justify").run(),
            isActive: editor.isActive({ textAlign: "justify" }),
        },
    ];

    const getActiveAlignIcon = () => {
        if (editor.isActive({ textAlign: "center" }))
            return <AlignCenter className="h-4 w-4" />;
        if (editor.isActive({ textAlign: "right" }))
            return <AlignRight className="h-4 w-4" />;
        if (editor.isActive({ textAlign: "justify" }))
            return <AlignJustify className="h-4 w-4" />;
        return <AlignLeft className="h-4 w-4" />;
    };

    return (
        <TooltipProvider delayDuration={300}>
            <div className="border border-border/50 rounded-lg overflow-hidden bg-ctp-surface0">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border/50 bg-ctp-mantle/50">
                    {/* Heading dropdown */}
                    <ToolbarDropdown
                        label="Heading"
                        icon={<Pilcrow className="h-3.5 w-3.5" />}
                        items={headingItems}
                        activeLabel={getActiveHeadingLabel()}
                    />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Text formatting */}
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        isActive={editor.isActive("bold")}
                        tooltip="Bold (Ctrl+B)"
                    >
                        <Bold className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        isActive={editor.isActive("italic")}
                        tooltip="Italic (Ctrl+I)"
                    >
                        <Italic className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        isActive={editor.isActive("underline")}
                        tooltip="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleStrike().run()
                        }
                        isActive={editor.isActive("strike")}
                        tooltip="Strikethrough"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleCode().run()
                        }
                        isActive={editor.isActive("code")}
                        tooltip="Inline Code"
                    >
                        <Code className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleHighlight().run()
                        }
                        isActive={editor.isActive("highlight")}
                        tooltip="Highlight"
                    >
                        <Highlighter className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Superscript / Subscript */}
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleSuperscript().run()
                        }
                        isActive={editor.isActive("superscript")}
                        tooltip="Superscript"
                    >
                        <SuperscriptIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleSubscript().run()
                        }
                        isActive={editor.isActive("subscript")}
                        tooltip="Subscript"
                    >
                        <SubscriptIcon className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Lists dropdown */}
                    <ToolbarDropdown
                        label="Lists"
                        icon={<List className="h-3.5 w-3.5" />}
                        items={listItems}
                        activeLabel={getActiveListLabel()}
                    />

                    {/* Text alignment dropdown */}
                    <ToolbarDropdown
                        label="Alignment"
                        icon={getActiveAlignIcon()}
                        items={alignItems}
                    />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Block elements */}
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                        isActive={editor.isActive("blockquote")}
                        tooltip="Blockquote"
                    >
                        <Quote className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleCodeBlock().run()
                        }
                        isActive={editor.isActive("codeBlock")}
                        tooltip="Code Block"
                    >
                        <Code2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().setHorizontalRule().run()
                        }
                        tooltip="Horizontal Rule"
                    >
                        <Minus className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    {/* Links & Images */}
                    <ToolbarButton
                        onClick={setLink}
                        isActive={editor.isActive("link")}
                        tooltip="Add Link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={addImage} tooltip="Add Image">
                        <ImageIcon className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="flex-1" />

                    {/* Code block language selector — shown when cursor is in a code block */}
                    {isInCodeBlock && (
                        <select
                            value={currentLanguage}
                            onChange={(e) =>
                                editor
                                    .chain()
                                    .focus()
                                    .updateAttributes("codeBlock", {
                                        language: e.target.value,
                                    })
                                    .run()
                            }
                            className="h-7 text-xs rounded-md border border-border/50 bg-ctp-surface0 text-foreground px-1.5 mr-2 outline-none focus:ring-1 focus:ring-ctp-mauve"
                        >
                            {CODE_LANGUAGES.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Undo / Redo */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        tooltip="Undo (Ctrl+Z)"
                    >
                        <Undo className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        tooltip="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo className="h-4 w-4" />
                    </ToolbarButton>
                </div>

                {/* Editor content */}
                <EditorContent editor={editor} />
            </div>
        </TooltipProvider>
    );
}
