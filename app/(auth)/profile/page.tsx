"use client"
import { useAuthStore } from "@/stores/useAuthStore";

export default  function ProfilePage() {
    const user = useAuthStore().user
    console.log(user)
    return (
        <div>
            <h1>Profile</h1>
            <h2>{user?.fullName}</h2>
            <p>{user?.email}</p>
        </div>
    );
}