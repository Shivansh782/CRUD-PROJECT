"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

import { Moon, Search, Sun } from "lucide-react";
import { AddDataDialog } from "@/components/dashboard/AddDataDialog";
import { db } from "@/utils/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserTable } from "@/components/dashboard/UserTable";
import { UserDetailsDialog } from "@/components/dashboard/UserDetailsDialog";
import type { User } from "../../components/types/user";
import LogoutButton from "@/components/logout";
import Image from "next/image";
import { adminEmails } from "@/components/types/adminMails";

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | null;
    direction: "ascending" | "descending" | null;
  }>({ key: null, direction: null });
  // const [roleFilter, setRoleFilter] = useState("All");
  // const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  useEffect(() => {
    const usersCollection = collection(db, "users");

    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as unknown as User)
      );
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const darkModeEnabled = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModeEnabled);
    if (darkModeEnabled) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!isDarkMode).toString());
  };

  const handleSort = (key: keyof User) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = users
    .filter(
      (user) =>
        // (roleFilter === "All" || user.role === roleFilter) &&
        // (statusFilter === "All" || user.status === statusFilter) &&
        (departmentFilter === "All" || user.department === departmentFilter) &&
        (searchQuery === "" ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
      }
      return 0;
    });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  // const roles = ["All", ...new Set(users.map((user) => user.role))];
  // const statuses = ["All", ...new Set(users.map((user) => user.status))];
  const departments = ["All", ...new Set(users.map((user) => user.department))];

  const deleteUser = async (user: User) => {
    if (!user.id) return;
    try {
      await deleteDoc(doc(db, "users", user.id.toString())); // Deletes the user from Firestore
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id)); // Updates state
      console.log("User deleted:", user);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <div
        className={`flex min-h-screen w-full flex-col bg-background transition-colors duration-300 ${
          isDarkMode ? "dark" : ""
        }`}
      >
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-24 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
            <div className="container mx-auto flex justify-between items-center w-full">
              <div className="flex flex-1 items-center gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">
                USER MANAGEMENT
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  // className="rounded-full"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                <LogoutButton />
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 container mx-auto h-full">
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4  justify-between">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-end gap-4 max-md:justify-between justify-end ">
                <div className="flex items-center gap-2">
                  {/* <label htmlFor="departmentFilter">Department:</label> */}
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-[180px]" id="departmentFilter">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Department</SelectLabel>
                        {departments.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {isAdmin && <AddDataDialog />}
              </div>
            </div>

            <Card className="overflow-hidden py-0 rounded-md">
              <CardContent className="p-0">
                <UserTable
                  users={filteredAndSortedUsers}
                  onSort={handleSort}
                  onViewUser={handleViewUser}
                  onEditUser={handleViewUser}
                  deleteUser={deleteUser}
                />
              </CardContent>
            </Card>
          </main>
        </div>

        <UserDetailsDialog
          user={selectedUser}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </>
  );
}
