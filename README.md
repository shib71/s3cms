


## Setup

1. Create a Google API project
   a) Set the OAuth settings
   b) Create API credentials
      - add the final domain and the S3 domain as allowed hosts
      - make a note of the client ID as `clientID`
   c) Enable profile API

2. Log into AWS (or create an account if necessary)
   - make a note of your account number as `accountId`

3. Create an S3 bucket with the same name as the final domain name.
   - enable Static Website Hosting
   - make a note of the name as `bucket`
   - make a note of the region as `region`

4. Create a Cognito identity pool
   - for clarify, you could name it after the domain too.
   - do not enable unauthenticated users
   - add the `clientID` for the Google+ provider
   - you will be prompted to create an IAM role for authenticated users - this role will be updated by this project
   - make a note of the identity pool as `identityPoolId`
   - make a note of the IAM role ID as `adminRoleArn`
   - make a note of the Cognito region as `cognitoRegion`
   - make a note of the policy name in your new role as `adminRolePolicyName`

5. Create an IAM account with this policy:
   
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["s3:ListBucket"],
                "Resource": ["arn:aws:s3:::{bucket}"]
            },
            {
                "Effect": "Allow",
                "Action": ["s3:*"],
                "Resource": ["arn:aws:s3:::{bucket}/*"]
            },
            {
                "Effect": "Allow",
                "Action": [
                    "iam:GetPolicy",
                    "iam:GetPolicyVersion",
                    "iam:GetRole",
                    "iam:GetRolePolicy",
                    "iam:PutRolePolicy"
                ],
                "Resource": [
                    "{adminRoleArn}",
                    "arn:aws:iam::313192320421:policy/{adminRolePolicyName}"
                ]
            },
            {
                "Effect": "Allow",
                "Action": ["cognito-sync:*"],
                "Resource": ["arn:aws:cognito:us-east-1:{accountId}:identitypool/*"]
            }
        ]
    }

   - this policy allows the IAM account to give the website Admin users any permission, so it is
     important that the credentials for the user be kept secure
   - in practice the IAM access is only used to add specific users as Admins
   - make a note of the access ID as `accessID`
   - make a note of the access secret as `accessSecret`

6. Edit `~/.aws/credentials` and add this code (subsitute your values for `accessID` and `accessSecret`):

    [default]
    aws_access_key_id = {accessID}
    aws_secret_access_key = {accessSecret}

7. Setup your version of this project
   a) Fork this project
   b) Clone your fork locally
   c) Install node
   d) Install grunt `npm install grunt -g`
   c) In the project directory, `npm update`

8. Edit `s3cms_project/config.js` and add this code (substute your values for the various values):



9. Push the project to your bucket with `grunt`


## Adding Admin Users



## Custom Content Types


