'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Divider, Space } from 'antd';
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    UndoOutlined,
    RedoOutlined,
} from '@ant-design/icons';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [history, setHistory] = useState<string[]>([value]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);

    // Khi `value` thay đổi từ bên ngoài, đồng bộ lại trong editor
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCommand = (command: string) => {
        document.execCommand(command, false, '');
        updateHistory();
    };

    const handleInput = () => {
        updateHistory();
    };

    const updateHistory = () => {
        const newValue = editorRef.current?.innerHTML || '';
        if (newValue === history[historyIndex]) return; // Không lưu nếu không có thay đổi

        const newHistory = history.slice(0, historyIndex + 1); // Cắt bỏ lịch sử cũ khi sửa
        setHistory([...newHistory, newValue]);
        setHistoryIndex(newHistory.length);
        onChange(newValue);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            if (editorRef.current) editorRef.current.innerHTML = history[newIndex];
            onChange(history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            if (editorRef.current) editorRef.current.innerHTML = history[newIndex];
            onChange(history[newIndex]);
        }
    };

    return (
        <div className="border rounded-md">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center p-2 border-b bg-gray-50">
                <Space>
                    <Button type="text" icon={<UndoOutlined />} size="small" onClick={undo} />
                    <Button type="text" icon={<RedoOutlined />} size="small" onClick={redo} />
                    <Divider type="vertical" />
                    <Button
                        type="text"
                        icon={<BoldOutlined />}
                        size="small"
                        onClick={() => execCommand('bold')}
                    />
                    <Button
                        type="text"
                        icon={<ItalicOutlined />}
                        size="small"
                        onClick={() => execCommand('italic')}
                    />
                    <Button
                        type="text"
                        icon={<UnderlineOutlined />}
                        size="small"
                        onClick={() => execCommand('underline')}
                    />
                    <Button
                        type="text"
                        icon={<StrikethroughOutlined />}
                        size="small"
                        onClick={() => execCommand('strikeThrough')}
                    />
                </Space>
            </div>

            {/* Content Editable Div */}
            <div
                ref={editorRef}
                className="w-full p-4 min-h-[200px] outline-none resize-none"
                contentEditable
                onInput={handleInput}
                style={{ whiteSpace: 'pre-wrap', minHeight: '200px', cursor: 'text' }}
            />
        </div>
    );
}
