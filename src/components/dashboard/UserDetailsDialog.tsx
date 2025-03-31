import {
  Calendar,
  BadgeCheck,
  Building2,
  Phone,
  Mail,
  Car,
  SmartphoneNfc,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { User } from "@/components/types/user";

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col text-center">
          <h2 className="text-3xl font-bold capitalize">{user.name}</h2>
          <p className="text-[#6a1c1c] font-semibold text-sm text-left capitalize">
            {user.designation}
          </p>
        </div>
      </div>

      <div className="border-t-2 border-black mt-4 pt-4">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold py-2 pr-4 flex items-center">
                <BadgeCheck className="h-5 w-5 mr-2" />
                ID
              </td>
              <td className="py-2">: {user.eid}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Department
              </td>
              <td className="py-2">: {user.department}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Joined
              </td>
              <td className="py-2">: {user.joinDate}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email
              </td>
              <td className="py-2">: {user.email}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Phone
              </td>
              <td className="py-2">: {user.phone}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4 flex items-center">
                <SmartphoneNfc className="h-5 w-5  mr-2" />
                Extension
              </td>
              <td className="py-2">: {user.extension}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4 flex items-center">
                <Car className="h-5 w-5  mr-2" />
                Vehicle
              </td>
              <td className="py-2">: {user.vehicle}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface UserDetailsDialogProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({
  user,
  isOpen,
  onOpenChange,
}: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">User Details</DialogTitle>

      <DialogContent className="sm:max-w-[400px] border-none overflow-hidden bg-indigo-50 text-black p-6">
        <UserCard user={user} />
      </DialogContent>
    </Dialog>
  );
}
