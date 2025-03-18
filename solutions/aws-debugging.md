# AWS Debugging Task
## 🔍 Problem
Error during Postgres upgrade.

## 🛠️ Resolution Plan
1. Restore from latest snapshot to a v13 cluster.
2. Point application to restored cluster. 
3. Create a pre-upgrade snapshot from restored cluster.
4. Setup new cluster using snapshot 
5. Drop incompatible extensions or alter if compatible version is available. 
6. Test the upgrade and produce restorage scripts. If the upgrade functions as expected, perform same on live cluster. If there is data non-parity, consider pg-dump.
7. Consider implementing Blue/Green deployment in future.
