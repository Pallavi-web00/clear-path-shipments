# SwiftParcel Logistics

Build a complete, modern Logistics & Parcel Delivery Management Web Application using Vite + React.

The UI theme must be White + Sky Blue, clean, modern, professional, responsive, and suitable for a real courier/logistics company.

Core Concept

The system manages parcels from the moment a customer creates a shipment until the driver delivers it.

There are 3 roles:

Admin

Driver

Customer

There must also be a public parcel tracking page where a receiver can enter a Tracking ID without logging in.

Authentication & Role Access

Implement secure role-based authentication.

Admin

Admin has complete access to the entire system.

Admin can:

View everything

Manage customers

Create drivers

Edit drivers

Activate/deactivate drivers

Assign parcels to drivers

View all shipments

View shipment tracking

View driver activity

View reports

Manage statuses

View dashboard statistics

Driver

Drivers cannot register themselves.

Only Admin can create a driver account.

Driver can:

Login using credentials created by Admin

View only parcels assigned to them

Accept or reject assigned parcels

See pickup/shipping location

See dropping/delivery location

Update parcel status

Mark parcel as picked up

Mark parcel as in transit

Mark parcel as out for delivery

Mark parcel as delivered

View their completed deliveries

A driver must never be able to access the Admin Panel.

Customer

Customer can:

Register

Login

Create a parcel/shipment

View their shipments

View shipment status

View tracking history

Track their parcel

Customers must only be able to see their own private shipment information.

Public Tracking

Create a public page:

Track Your Parcel

The receiver enters:

Tracking ID
[________________________]

[ Track Parcel ]


No login should be required.

When a valid Tracking ID is entered, display:

Tracking ID

Current status

Pickup location

Delivery location

Shipment date

Expected delivery date

Current location/status

Tracking timeline

Do not expose private customer information publicly.

If the Tracking ID is invalid:

Tracking ID not found. Please check your Tracking ID and try again.


Customer Dashboard

Create a modern customer dashboard with:

Total Shipments

Pending

In Transit

Delivered

Recent Shipments

Navigation:

Dashboard
Create Shipment
My Shipments
Track Parcel
Profile
Logout


Create Shipment

Create a professional shipment form.

Sender Details

Sender Name

Phone

Email

Address

City

State

Postal Code

Receiver Details

Receiver Name

Phone

Email

Address

City

State

Postal Code

Parcel Details

Parcel Type

Description

Weight

Quantity

Package Size

Fragile

Estimated Value

Special Instructions

Shipping Details

Pickup Location

Delivery Location

Pickup Date

Expected Delivery Date

When the customer creates a shipment:

Save the shipment.

Automatically generate a unique Tracking ID.

Set status to Pending.

Show the Tracking ID to the customer.

Allow the customer to copy the Tracking ID.

Show the shipment in My Shipments.

Make the shipment visible to Admin.

Example:

TRK-2026-8F4K92


Shipment Status Flow

Use this exact workflow:

Pending
   ↓
Assigned
   ↓
Accepted
   ↓
Picked Up
   ↓
In Transit
   ↓
Out for Delivery
   ↓
Delivered


Also support:

Rejected
Cancelled


Every status change must create a tracking event with:

Status

Date

Time

Location

Description

Updated By

Admin Dashboard

Create a professional admin dashboard.

Show:

Total Customers

Total Drivers

Total Shipments

Pending Shipments

Assigned Shipments

In Transit

Out for Delivery

Delivered

Cancelled

Add charts for:

Shipments by status

Shipments over time

Driver performance

Delivered vs pending shipments

Admin sidebar:

Dashboard
Shipments
Drivers
Customers
Assignments
Tracking
Reports
Settings
Logout


Admin Shipment Management

Admin can view every shipment.

Table columns:

Tracking ID
Customer
Receiver
Pickup Location
Delivery Location
Driver
Status
Created Date
Actions


Add:

Search

Tracking ID search

Status filter

Driver filter

Date filter

Pagination

Admin can:

View shipment

Assign driver

Change/cancel shipment

View complete tracking timeline

Assign Driver

Admin opens a shipment and sees:

Tracking ID
Pickup Location
Delivery Location
Shipment Information

Select Driver
[ Driver Name ]

[ Assign Driver ]


Only active drivers should appear.

After assignment:

Shipment status = Assigned

Driver receives the shipment

Customer can see that a driver has been assigned

Driver Management

Admin has a Driver Management page.

Show:

Driver Name
Email
Phone
Vehicle
Vehicle Number
License Number
Assigned Shipments
Completed Deliveries
Status
Actions


Admin can:

Create Driver

Edit Driver

Activate Driver

Deactivate Driver

Suspend Driver

Reset Password

Delete Driver

Create Driver form:

Full Name
Email
Phone
Password
License Number
Vehicle Type
Vehicle Number
Address
Status

[ Create Driver ]


Important:

There must be NO public driver registration page.

Driver Dashboard

Create a separate Driver Panel.

Driver navigation:

Dashboard
My Shipments
Pending Acceptance
Accepted
In Transit
Delivered
Profile
Logout


Dashboard cards:

Assigned Parcels

Waiting for Acceptance

Accepted Parcels

Pickups Today

Deliveries Today

In Transit

Delivered

Driver Shipment Details

When a driver opens a shipment, show two clearly separated sections.

PICKUP / SHIPPING LOCATION

Show:

Sender Name

Sender Phone

Pickup Address

Pickup City

Pickup State

Postal Code

Pickup Date

Use a location/map-style card.

DROPPING / DELIVERY LOCATION

Show:

Receiver Name

Receiver Phone

Delivery Address

Delivery City

Delivery State

Postal Code

Expected Delivery Date

Use another location/map-style card.

Connect the two locations visually:

📍 Pickup
     │
     │
     🚚 Shipment
     │
     │
📍 Delivery


Driver Accept Parcel

When Admin assigns a parcel to a driver, show:

New Parcel Assignment

Tracking ID: TRK-XXXXXXXX

Pickup:
Bangalore

Delivery:
Mysore

[ Accept Parcel ]
[ Reject Parcel ]


If accepted:

Status becomes Accepted

Save accepted timestamp

Add tracking event

Notify Admin

Customer sees updated status

If rejected:

Ask for:

Reason for rejection
[________________________]

[ Confirm Rejection ]


Then:

Notify Admin

Save rejection reason

Return shipment for reassignment

Driver Status Actions

After accepting:

[ Mark as Picked Up ]


Then:

[ Start In Transit ]


Then:

[ Out for Delivery ]


Then:

[ Mark Delivered ]


Drivers must only be able to perform valid next actions.

For example, a driver cannot mark a Pending shipment as Delivered.

Delivery Confirmation

Before completing delivery, show:

Confirm Delivery

Tracking ID
Receiver Name
Delivery Address

Delivery Notes
[________________________]

Receiver Signature
[ Signature Area ]

Delivery Photo
[ Upload Photo ]

[ Confirm Delivery ]


After confirmation:

Parcel Delivered Successfully


Save:

Delivered timestamp

Delivery location

Driver

Delivery notes

Optional signature

Optional photo

Tracking Timeline

Create a beautiful vertical tracking timeline.

Example:

✓ Shipment Created
  26 Aug 2026 • 09:30

✓ Driver Assigned
  26 Aug 2026 • 10:15

✓ Driver Accepted
  26 Aug 2026 • 10:30

✓ Parcel Picked Up
  26 Aug 2026 • 12:00

● In Transit
  Current Status

○ Out for Delivery

○ Delivered


Use Sky Blue for completed/current steps and gray for future steps.

Customer Shipment History

Show:

Tracking ID
Receiver
Pickup
Delivery
Driver
Status
Created Date
Action


Customer can click View Details.

Admin Tracking

Admin should be able to search any Tracking ID and see:

Customer

Sender

Receiver

Driver

Pickup

Delivery

Current status

Full tracking timeline

All status changes

Driver actions

Timestamps

Notifications

Create an in-app notification system.

Customer notifications:

Shipment created

Driver assigned

Driver accepted

Parcel picked up

Parcel in transit

Out for delivery

Parcel delivered

Admin notifications:

New shipment created

Driver accepted

Driver rejected

Parcel picked up

Parcel delivered

Driver notifications:

New parcel assigned

Assignment changed

Admin reassigned parcel

Database Models

Create database models for:

Users

id
name
email
phone
password
role
status
createdAt
updatedAt


Roles:

admin
driver
customer


Drivers

id
userId
licenseNumber
vehicleType
vehicleNumber
address
status
createdAt
updatedAt


Customers

id
userId
address
city
state
postalCode
createdAt
updatedAt


Shipments

id
trackingId
customerId
driverId

senderName
senderPhone
senderEmail
senderAddress
senderCity
senderState
senderPostalCode

receiverName
receiverPhone
receiverEmail
receiverAddress
receiverCity
receiverState
receiverPostalCode

parcelType
description
weight
quantity
packageSize
fragile
estimatedValue
specialInstructions

pickupLocation
deliveryLocation

status

pickupDate
expectedDeliveryDate
pickedUpAt
deliveredAt

createdAt
updatedAt


Tracking Events

id
shipmentId
status
location
description
updatedBy
createdAt


Driver Assignments

id
shipmentId
driverId
assignedBy
assignedAt
acceptedAt
rejectedAt
rejectionReason
status


Security

Implement real role-based authorization.

Do not rely only on frontend route protection.

Backend must verify:

Admin → Everything

Driver → Only assigned shipments

Customer → Only own shipments

Public → Tracking ID information only


Protect all API endpoints.

Use secure password hashing and authentication tokens/sessions.

Design

Use:

Primary: #0EA5E9
Dark Blue: #0369A1
Light Blue: #E0F2FE
Background: #F8FAFC
White: #FFFFFF
Text: #0F172A
Muted: #64748B
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444


Design style:

White backgrounds

Sky-blue primary buttons

Sky-blue icons

Soft shadows

Rounded cards

Clean tables

Modern dashboard cards

Professional typography

Minimal gradients

Responsive layout

Mobile-friendly navigation

Use Lucide icons for:

Package

Truck

Map Pin

User

Users

Check

Clock

Search

Navigation

Calendar

Bell

Settings

Log Out

Project Structure

Use a scalable structure:

src/
├── components/
├── layouts/
├── pages/
│   ├── admin/
│   ├── driver/
│   ├── customer/
│   └── public/
├── routes/
├── services/
├── hooks/
├── context/
├── utils/
├── assets/
├── types/
├── App.jsx
└── main.jsx


Create reusable components:

Sidebar
Topbar
StatCard
StatusBadge
ShipmentTable
ShipmentCard
ShipmentForm
TrackingTimeline
DriverAssignmentModal
NotificationDropdown
ProtectedRoute
RoleGuard
LocationCard
ConfirmationModal
LoadingState
EmptyState


Required Pages

Create these pages:

Public

/
 /track
 /login
 /register


Admin

/admin/dashboard
/admin/shipments
/admin/drivers
/admin/customers
/admin/assignments
/admin/tracking
/admin/reports
/admin/settings


Driver

/driver/dashboard
/driver/shipments
/driver/shipments/:id
/driver/accepted
/driver/in-transit
/driver/delivered
/driver/profile


Customer

/customer/dashboard
/customer/create-shipment
/customer/shipments
/customer/shipments/:id
/customer/track
/customer/profile


Responsive Requirements

The application must work perfectly on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Sidebar becomes a drawer

Tables become cards where necessary

Forms become single-column

Dashboard cards become responsive

Tracking timeline remains easy to read

Buttons are touch-friendly

Demo Workflow

Include realistic demo data so the complete workflow can be tested:

Customer
   ↓
Creates Parcel
   ↓
System Generates Tracking ID
   ↓
Admin Sees Shipment
   ↓
Admin Assigns Driver
   ↓
Driver Receives Assignment
   ↓
Driver Accepts Parcel
   ↓
Driver Goes to Pickup Location
   ↓
Driver Marks Picked Up
   ↓
Driver Marks In Transit
   ↓
Driver Marks Out for Delivery
   ↓
Driver Delivers Parcel
   ↓
Driver Confirms Delivery
   ↓
Status = Delivered
   ↓
Receiver Tracks Parcel Using Tracking ID


Important Final Instructions

Build this as a real functional logistics application, not just a static UI mockup.

All buttons, forms, filters, authentication flows, role permissions, shipment creation, Tracking ID generation, driver assignment, driver acceptance/rejection, status changes, and tracking timeline should be implemented.

Use clean reusable React components and maintainable code.

If a backend is required, structure the project so the React frontend communicates with a REST API and database.

The most important features are:

Admin creates drivers → Customer creates parcel → Tracking ID is generated → Admin assigns driver → Driver accepts parcel → Driver sees pickup and delivery locations → Driver updates shipment status → Receiver tracks parcel using Tracking ID → Driver confirms delivery → Admin can see everything.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8da3e7a0-3c1b-4d40-a832-bfb0ddefc715).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
