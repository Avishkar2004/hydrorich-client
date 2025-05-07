import React from 'react'

function Profile() {
  // Mock user data - in a real app, this would come from your backend/state management
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'User',
    joinDate: 'January 2024',
    bio: 'Passionate about technology and innovation.'
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.role}</p>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Contact Information</h2>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">About</h2>
            <p className="text-gray-600">{user.bio}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Account Information</h2>
            <p className="text-gray-600">Member since: {user.joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile