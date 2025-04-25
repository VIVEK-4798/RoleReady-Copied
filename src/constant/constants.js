import { isAdminLoggedIn } from "@/utils/DOMUtils";

export const bookingState = () => {
	const array = [
		"All Booking",
		"Pending",
		"In Progress",
		"Confirmed",
		"Cancelled",
	];
	// if (isAdminLoggedIn()) {
	// 	array.push("Vendor");
	// 	array.push("Venue");
	// }
	return array;
}

export const bookingStateArray = [
	"Pending",
	"In Progress",
	"Confirmed",
	"Cancelled"
];

export const claimStateArray = [
	"Pending",
	"Approved",
	"Rejected"
];

export const Roles = [
	{
		roleName: "Venue User",
		roleUserName: "venue-user"
	},
	{
		roleName: "Vendor User",
		roleUserName: "vendor-user"
	},
	{
		roleName: "User",
		roleUserName: "user"
	}
]