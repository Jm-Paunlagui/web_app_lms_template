# WEB_CORE
## To secure website must check code from this files.
- htaccess - security of file access 
- global_func.php - user input sanitizing and prevent XSS Attack
- connect.php - sanitize MYSQL query
- (include your own CSRF Token and Session Handling) - its important, ## REQUIRED (Pagchineck ko system nyo)
- All upload folder must be protected using php and htaccess


### Admin Side [dev.lms.ccc.edu.ph/app/admin] for checking functionality

> To gain access basic auth
> usename : admin
> password: CCC_MIS@123$#~15

#### admin credential: 

> ##ADMIN
> usename : ADMIN_TEST
> password: ADMIN_TEST
>
> ##REGISTRAR
> usename : REGS_TEST
> password: REGS_TEST

##### Teacher [dev.lms.ccc.edu.ph] for checking functionality

> ##TEACHER
> usename : TEACHER_TEST@ccc.edu.ph
> password: TEACHER_TEST


```php
## roles variable
$g_user_role  == array for roles 
if(!($g_user_role[0] == "TEACHER")){  
	header("Location: ".BASE_URL);
	exit();
}
## TEACHER,STUDENT,ADMIN,REGISTRAR,DIRECTOR

if(!($g_user_role[1] == "DIRECTOR")){  
	header("Location: ".BASE_URL);
	exit();
}

### SESSION 
$session_class->setValue('user_id',$row_teacher['teacher_id']);
$role = array('TEACHER');
>> $role[1] = 'DIRECTOR'; if director
$session_class->setValue('role_id',$roles);
$session_class->setValue('photo',$row_teacher['location']);
$session_class->setValue('name',$row_teacher['firstname']." ".$row_teacher['lastname']);
$session_class->setValue('agent_browser',$agent);
$fingerprint = $session_class->getValue('fingerprint');
$session_class->setValue('browser_fingerprint',$fingerprint);

### CONSTANT variable
$s_user_id ==> variable for user_id
$g_user_name ==>  user fullname
BASE_URL ==> constant for base url (https://localhost
DOMAIN_PATH ==> access folder absolute path
```

## Installation

Copy or Clone this project.

Import the database (optional)

### Login
- Username: ituser
- Password: admin

## For Design and JS > but you can use your own design (CSS Template)
- Use bootstrap 4+
- jQuery

## File Folder Structures
- app                 - contain php script for login users
  - global            - all base (sidebar, topheader, all inlcude js and css)
- call_func           - contain global function and connection
   - cl_session.php   - session manager with csrf token.
   - global_func.php  - all global function that does need database connection
   - connect.php      - global function for database connection
   - islogin.php      - put all your logic if user is successfully login
- config              - contain configuration files for system
- css                 - all css files
- error_page          - error page to be use when encounter 404 or other error
- fonts               - fonts file
- images              - all image used in design
- js                  - js folder 
- upload              - all upload file from users
  - chunks            - chunk file from fine-uploader
  - csv               - all csv file uploaded
  - files             - all file uploaded put here
  - guides            - downloadable files
  - logs              - all php error logs
  - webfonts          - extra font folder
  - .htaccess         - any .htaccess is for security filtering



### EXAMPLE PHP CODE:
- [escape] function - use to sanitize user input before any mysql query (INSERT, UPDATE, DELETE, SELECT)
```php
<?php
$value = escape(<database connection variable> ,<variable to sanitize>]);
$value = escape($db_connect,$_GET['id']);	
$default_query ="SELECT ".$field_query." FROM ".$table_name." WHERE field = '".$value."'";
or
$default_query ="SELECT ".$field_query." FROM ".$table_name." WHERE field = '".escape($db_connect,$_GET['id'])."'";
?>
```

- [var_html] function - use to sanitize database data to output in user page <for string variable>
- [array_html] function - use to sanitize database data array to output in user page <for array>
  [js_clean] function - use to sanitize database data to output in user page <for variable string, and if your data is html  or from text editor>
  [js_clean_array] function - use to sanitize database data to output in user page <for array string, and if your data is html  or from text editor>
```php
<?php
$header_code = "<h1>A heading here</h1><script>alert('HACKED');</script>";

##################################
##using js_clean
$header_code = js_clean($header_code);

## output script tag remove 
output: <h1>A heading here</h1>alert('HACKED');"
#################################

#################################
##using var_html - also use js_clean
$header_code = var_html($header_code);

## output script tag remove and convert to htmlencoded
output: &lt;h1&gt;A heading here&lt;/h1&gt;alert(&#39;HACKED&#39;);"
################################

################################
##using array_html - also use js_clean_array, for array input
$header_code[0] =  "<h1>A heading here</h1><script>alert('HACKED');</script>";
$header_code = array_html($header_code);

## output script tag remove and convert to htmlencoded
output header_code[0]: &lt;h1&gt;A heading here&lt;/h1&gt;alert(&#39;HACKED&#39;);"
################################
?>
```
  
 - [csrf token] - check the example in the given link
 - [session] - check the example in the given link
  ### [php-csrf v1.0.2] https://github.com/GramThanos/php-csrf reference
  ### [Asdfdotdev] https://github.com/asdfdotdev/session/tree/main/_examples reference
  
```php
<?php
###############################################
## csrf-token
require CL_SESSION_PATH; # Include the PHP-CSRF library and Session 
$csrf = new CSRF($session_class);  // Initialize an instance

// If form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate that a correct token was given
    if ($csrf->validate('my-form')) {
        // Success
    }
    else {
        // Failure
    }
}

?>
  
<!-- Your normal HTML form -->
<form method="POST">
    <!-- Print a hidden hash input -->
    <?=$csrf->input('my-form');?>
    ...
    <input type="submit" value="Submit"/>
</form>

##############################################
  
##############################################
## access session
//  Set New Value
$session->setValue('my_variable','new value');
  
//  Increment Value
$session->incValue('my_variable', 1);

//  Append to Value
$session->appValue('my_variable','appended to current value');

//  Hash Stored Value
$session->setValue('my_variable','value_to_hash', true);
 
//  Get Stored Value
$session->getValue('my_variable');
  
//  Delete Stored Value
$session->dropValue('my_variable');
```

- [output] function - use to convert array to JSON enocode
```php
  Disclaimer there's no test done for this example but this is the expected.
 ####################################
$header_code = array();
$header_code['first_section'] =  array('one'=>1);
$header_code['second_section'] =  ['second_section'=>['second_section'=>['two' => '1 associated']]];
$header_json = output($header_code); //convert array to json array
  
output: $header_json 
[
  'first_section' => [
    'one' => '1',
  ],
  'second_section' => [
    'second_section' => [
      'two' => '1 associated',
    ],
  ],
]
#################################################
  
#################################################
### server.php
$response_msg['data'] = '';
$response_msg['errors'] = 'Invalid Auth-Token!';
$response_msg['result']= 'error';
echo output($response_msg);
exit();
 
  
### form or ajax
  
       $.ajax({
						url: '<?php echo BASE_URL;?>app/server.php',
						type: 'POST',
						//accepts:"application/json",
						data: { ids:class_json,token_add_quiz: global_token},
						error: function() {
							warning_notif('Internal Error Occured!');
						},
						success: function(res) {
							if(res){
								if(res.result == "success"){
									  success_notif('Successfully Saved!');
									  setTimeout(function(){ refresh_aftersave(); }, 1000);
								}else if(res.result == "error"){
									  warning_notif(res.error);
								}
									
							}           
						}
					});

 output:
 warning modal > 'Invalid Auth Token'

```
  
- [is_digit] function - use always in ID (numeric) validation
```php
  
 if(is_digit($get_id)){
    //valid numeric or number
 }
  
 $get_id = 0; // true
 $get_id = -1; // false
 $get_id = 1e0; // false
 $get_id = false; // false
 $get_id = true; // false
 $get_id = 12; // true

```
 [js modal toast] - for display success or error location: /app/globa/inclucde_bottom.php
```js
 ##syntax
  var opt = {position:'top-end',timer:3000,confirm:false,progress:true,bg:"#2f96b4"};
  ###opt = optional variable 
  info_notif("Successfully Saved",opt);
 
  warning_notif("Orange Color",opt);
  error_notif("Red Error",opt);
  success_notif("Green Color",opt);
  info_notif("Blue Color",opt);
  
  ###opt = optional is variable 
  warning_notif("Orange Color");
  error_notif("Red Error");
  success_notif("Green Color");
  info_notif("Blue Color");
 
```
  
##Example mysql query
```php
  
$collect_class_id = array();
$default_query = "SELECT * FROM teacher_class as tc ".$sql_conds;
if($query = call_mysql_query($default_query)){
	if($num = call_mysql_num_rows($query)){
		while($data = call_mysql_fetch_array($query)){
			$id = $data['teacher_class_id'];
			$collect_data[$id] = array_html($data);
		}
	}
	mysqli_free_result($query);
}
```
