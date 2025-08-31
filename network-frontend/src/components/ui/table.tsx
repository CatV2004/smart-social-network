import React, { ReactNode } from "react";

export interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => (
  <div className={`overflow-x-auto ${className || ""}`}>
    <table className="w-full border-collapse">{children}</table>
  </div>
);

export const TableHeader: React.FC<TableProps> = ({ children }) => (
  <thead className="bg-gray-100">{children}</thead>
);

export const TableBody: React.FC<TableProps> = ({ children }) => (
  <tbody>{children}</tbody>
);

export const TableRow: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <tr className={`border-b ${className || ""}`}>{children}</tr>
);

export const TableHead: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <th
    className={`px-4 py-2 text-left text-sm font-medium text-gray-700 ${
      className || ""
    }`}
  >
    {children}
  </th>
);

export const TableCell: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <td className={`px-4 py-2 text-sm text-gray-600 ${className || ""}`}>
    {children}
  </td>
);
