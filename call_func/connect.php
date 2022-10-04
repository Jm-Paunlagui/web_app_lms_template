<?php
defined('DOMAIN_PATH') || define('DOMAIN_PATH', dirname(__DIR__));
include DOMAIN_PATH.'/config/db_data.php';
$db_connect = mysqli_connect(HOST,DB_USER,DB_PASS,DB_NAME);

if (mysqli_connect_errno()){
  $error = "Failed to connect to Database: " . mysqli_connect_error();
  error_log($error);
  echo $error;
  exit();
}

function escape($con = "",$str=""){
	global $db_connect;
	$string=mysqli_real_escape_string($db_connect,$str);
	return $string;
}

function db_close(){
	global $db_connect;
	mysqli_close($db_connect);
}

function call_mysql_query($query,$connect = ''){
	global $db_connect;
	$connect = empty($connect) ? $db_connect : $connect;
	if(empty($query)) { return false; }
    $r = mysqli_query($connect,$query);
    return $r;
}


function call_mysql_fetch_array($query,$resulttype=MYSQLI_ASSOC,$connect=''){
	global $db_connect;
	return mysqli_fetch_array($query,$resulttype);
}

function call_mysql_num_rows($query){
	$result = 0;
	if($query){
		$result = mysqli_num_rows($query);
	}
	return $result;
}

function call_mysql_affected_rows($connect = ''){
	global $db_connect;
	$connect = empty($connect) ? $db_connect : $connect;
	return mysqli_affected_rows($connect);
}


function mysqli_query_return($sql_query,$connect = ""){
	global $db_connect;
	$connect = empty($connect) ? $db_connect : $connect;
	$rdata = array();
	if(empty($sql_query)) { return $rdata;}  
	
  	if($query = mysqli_query($connect,$sql_query)){
		if($num = mysqli_num_rows($query)){
			while($data = mysqli_fetch_array($query,MYSQLI_ASSOC)){
				array_push($rdata,$data);
			}
		}
	}

	return $rdata;
}

function mysqliquery_return($sql_query,$connect ="",$type = MYSQLI_ASSOC){
	global $db_connect;
	
	$connect = (empty($connect)) ? $db_connect : $connect;
    $rdata = array();
	
	if($query=mysqli_query($connect,$sql_query)){
		$num=mysqli_num_rows($query);
		if($num > 0){
			while($data=mysqli_fetch_array($query,$type)){
				$rdata[] = $data;
			}
		}
	}
	return $rdata;
}

function  activity_log_new($action){
	global $db_connect,$session_class;
	$date_now = date('Y-m-d H:i:s');
	$s_user_id = $session_class->getValue('user_id');
	$role_txt = $session_class->getValue('role_id');
	$fingerprint = $session_class->getValue('browser_fingerprint');
	$role_id = 0;
	
	if($role_txt[0] == "ADMIN"){
		$role_id = 1;
	}else if($role_txt[0]  == "REGISTRAR"){
		$role_id = 2;
	}
	if (!empty($s_user_id) AND trim($action) !="") { // may user
		
		$insert = "INSERT INTO activity_log( user_id, action, date_log,session_id, user_level) ";
		$insert .= "VALUES ( '".$s_user_id."', '".escape($db_connect,$action)."','".$date_now."','".$fingerprint."', ".$role_id.") ";
		
		error_log($insert);
		if(mysqli_query($db_connect,$insert)){
				return true;
		}
	}
	return false;
}


function  user_log($action,$agents=array()){
	global $db_connect,$session_class;
	$date_now = date('Y-m-d H:i:s');
	$s_user_id = $session_class->getValue('user_id');
	$fingerprint = $session_class->getValue('browser_fingerprint');
	$ip =get_ip();
	
	$device = array();
	$device = json_encode($agents);

	if (!empty($s_user_id) AND trim($action) !="") { // may user
		if($action == "LOGIN"){
			$insert = "INSERT INTO user_log( login_date, action,user_id,session_id,ip_address,device) ";
			$insert .= "VALUES ( '".$date_now."','".$action."', '".$s_user_id."','".$fingerprint."','".$ip."','".escape($db_connect,$device)."') ";
			if(mysqli_query($db_connect,$insert)){
					return true;
			}
		}else if($action =='LOGOUT'){
			$update = "UPDATE user_log set logout_date = NOW() WHERE session_id = '".$fingerprint."'";
			if(mysqli_query($db_connect,$update)){
					return true;
			}

		}
	}
	return false;
}

function get_profile_pic($user_id,$field,$table){
	global $db_connect;
	$path ="";
	if(trim($user_id)=="" ||  trim($field)=="" || trim($table)==""){
		return "";
	}
	$query = "SELECT location FROM ".$table." WHERE ".$field ." = '".$user_id."' LIMIT 1";
	if($query=mysqli_query($db_connect,$query)){
	    $num=mysqli_num_rows($query);
	    if($num !=0){
	        if($data=mysqli_fetch_array($query,MYSQLI_ASSOC)){
	        	$path = empty($data['location']) ? "" : BASE_URL.$data['location'];
	        }
	    }
	}
	
	return $path;
}
?>
