"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

export type GenericTableProps<T extends object> = {
    data: T[];                         // ข้อมูลเรียงเป็น array ของ object
    columns: ColumnDef<T>[];          // column definitions ของ @tanstack/react-table
    className?: string;               // optional class สำหรับ table
    onRowClick?: (row: T) => void;    // callback เมื่อคลิกแถว
    rowKey?: (row: T) => string;      // ถ้าต้องการ key เฉพาะสำหรับแต่ละแถว (default ใช้ index)
};

export default function SimpleTable<T extends object>({
    data,
    columns,
    className = "w-full",
    onRowClick,
    rowKey,
}: GenericTableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className={`border-collapse border border-gray-300 m-auto ${className}`}>
            <thead>
                {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                        {hg.headers.map((header) => (
                            <th key={header.id} className="border border-gray-200 p-2 bg-gray-100 text-left">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>

            <tbody>
                {table.getRowModel().rows.map((row, i) => {
                    const original = row.original as T;
                    const key = rowKey ? rowKey(original) : row.id ?? String(i);
                    return (
                        <tr
                            key={key}
                            onClick={() => onRowClick?.(original)}
                            className={onRowClick ? "cursor-pointer" : undefined}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="border border-gray-100 p-2 hover:text-blue-600 hover:bg-gray-50">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
