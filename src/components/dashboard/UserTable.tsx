"use client";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { User } from "../types/user";
import { EditDataDialog } from "./EditDataDialog";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { adminEmails } from "../types/adminMails";

interface UserTableProps {
  users: User[];
  onSort: (key: keyof User) => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  deleteUser: (user: User) => void;
}

export function UserTable({
  users,
  onSort,
  onViewUser,
  onEditUser,
  deleteUser,
}: UserTableProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(user ? adminEmails.includes(user.email || "") : false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <Table className="rounded-sm">
      <TableHeader>
        <TableRow>
          <TableHead>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => onSort("name")}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead className="text-left hidden lg:table-cell">
            Designation
          </TableHead>
          <TableHead className="text-left table-cell">Department</TableHead>
          <TableHead className="hidden lg:table-cell text-left">
            Ext. No.
          </TableHead>
          <TableHead className="hidden lg:table-cell text-left">
            Ph. No.
          </TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence>
          {users.map((user, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TableCell className="capitalize">{user.name}</TableCell>
              <TableCell className="capitalize">{user.department}</TableCell>
              <TableCell className=" hidden lg:table-cell capitalize">
                {user.designation}
              </TableCell>
              <TableCell className="hidden lg:table-cell capitalize">
                {user.extension}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {user.phone}
              </TableCell>
              <TableCell className="text-center flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewUser(user)}
                  className="rounded-full"
                >
                  View
                </Button>
                {isAdmin && (
                  <EditDataDialog user={user} onEditUser={onEditUser} />
                )}

                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteUser(user)}
                    className="rounded-full"
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </TableBody>
    </Table>
  );
}
