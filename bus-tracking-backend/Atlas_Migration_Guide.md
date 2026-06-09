# MongoDB Atlas Migration Guide

This guide describes how to migrate the Hyderabad Smart Transit Platform database from a local instance to MongoDB Atlas.

## Step 1: Create a MongoDB Atlas Account and Cluster
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Project (e.g., `Hyderabad Transit`).
3. Deploy a free tier cluster (M0 Sandbox) in your preferred region.

## Step 2: Configure Security Settings
1. **Database Access**:
   - Create a database user (e.g., `transit_user`).
   - Set a strong password.
   - Assign the **Read and Write to any database** role.
2. **Network Access**:
   - Whitelist the IP addresses that require access.
   - For platforms like Render/Railway where dynamic outbound IPs are used, add `0.0.0.0/0` (Access from anywhere) or set up a static IP proxy.

## Step 3: Retrieve the Connection String
1. Navigate to the Databases page, and click **Connect** for your cluster.
2. Choose **Connect your application** (Node.js driver).
3. Copy the SRV connection string:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/bus_tracking?retryWrites=true&w=majority`

## Step 4: Run the Transit Seed Import Script
To seed your remote Atlas database instance:
1. Update the `MONGO_URI` variable inside your backend `.env` file to match the retrieved connection string (replacing `<username>` and `<password>` with your database user credentials).
2. From the `bus-tracking-backend` directory, run:
   ```bash
   node imports/importTransitData.js
   ```
3. Log in to the Atlas web interface, click **Browse Collections**, and verify that the `stops`, `routes`, and `routestops` collections are created and fully seeded.
