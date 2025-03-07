import React from "react";
import { Skeleton } from "@/app/_components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";

const ProjectLoader = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-7 w-32" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-7 w-48" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-7 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-7 w-24" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 2 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-7 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-7 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-7 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-7 w-24" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectLoader;
