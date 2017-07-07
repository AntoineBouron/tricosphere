<?php 
chdir(dirname(__DIR__));
require_once('vendor/autoload.php');

$conf = include('conf.php'); 	
define('HOST', $conf['host']);
define('DBNAME', $conf['db_name']);
define('DBLOGIN', $conf['db_login']);
define('DBPASSWORD', $conf['db_password']);
define('APIKEY', $conf['apiKey']);
define('SALT', $conf['salt']);



$confSlim['displayErrorDetails'] = true;

use Firebase\JWT\JWT;

$app = new \Slim\App(["settings" => $confSlim]);

$app->add(new \Slim\Middleware\JwtAuthentication([
    "secret" => APIKEY,
	"path" => ["/"],
    "passthrough" => ["/resetPassword", "/signup", "/login"],
    "callback" => function ($request, $response, $options) use ($app) {
        $app->jwt = $options["decoded"];
    }
]));


/*$app->GET("/toto", function ($request, $response, $conf)  use ($app) {
	$pdo = getPDO($conf);
	//$q = $pdo->query("SELECT * FROM account");
	$data = ["id"=> "1"];
	return $response->withJson(JWT::encode($data, APIKEY), 200);

});*/

/**
 * Retourne toujours une chaine vide
 * Sert a verifier si le token envoye dans le header de la requete est valide
 * vis a vis de la cle secrete definie dans le fichier de conf.
 */
$app->GET("/isValidToken", function ($request, $response, $conf)  use ($app) {
	return $response->withJson("", 200);
});

/**
 * LOGIN
 * status : 200 => user correctement identifie // compte valide
 * status : 403 => user correctement identifie // compte non valide
 * status : 401 => user mal identifie
 */
$app->POST("/login", function ($request, $response, $conf)  use ($app) {
	$postData = $request->getParsedBody();
	$pdo = getPDO($conf);
	$q = $pdo->query("SELECT * FROM account WHERE email='".$postData['email']."' AND password = '".md5(SALT.$postData['pwd'])."'");
	$r = $q->fetch(PDO::FETCH_ASSOC);
	if(sizeof($r) > 1) { // L'user s'est corectement identifie
		if ($r['waitingForValidation'] == "0") { // compte valide
			$status = 200;
			$token = array('userId' => $r['id'], 'role' => $r['role']);
			$data = array('token' => JWT::encode($token, APIKEY), 'msg' => 'Login ok');
		} else { // compte non valide
			$status = 403;
			$data = array('msg' => 'Il faut d\'abord que le compte soit validé!');
		}
	} else { // L'user ne s'est pas identifie correctement.
		$status = 403; // not authorize
		$data = array('msg' => 'Mauvaise combinaison utilisateur / mot de passe.');
	}
	return $response->withJson($data, $status);
});

/** SIGNUP **/
$app->POST("/signup", function ($request, $response, $conf)  use ($app) {
	$postData = $request->getParsedBody();
	if (!empty($postData)) {
		$pdo = getPDO($conf);

		$postData['waitingForValidation'] = 1;
		$postData['codeForValidation'] = sha1(mt_rand(10000,99999).time().$postData['email']);
		$postData['pwd1'] = md5(SALT.$postData['pwd1']);
		$postData['creationDate'] = date("Y-m-d H:i:s"); // MySQL DATETIME format
		$postData['role'] = '2';

		$req = "SELECT COUNT(*) as count FROM account WHERE email='".$postData['email']."' ";
		$q = $pdo->query($req);
		$r = $q->fetch(PDO::FETCH_NUM);

		if ($r[0]>1) {
			// verification que l'email n'est pas déjà utilisé
			$status = 403;
			$data = array('msg' => 'Adresse mail deja utilisee');
			return $response->withJson($data, $status);
		} else { 
			// insertion du nouveau user s'il n'est pas deja present
			$r = $pdo->exec("INSERT INTO account (firstname, lastname, email, waitingForValidation, codeForValidation, password, creationDate, role) VALUES ('".$postData['firstname']."', '".$postData['lastname']."', '".$postData['email']."', '".$postData['waitingForValidation']."', '".$postData['codeForValidation']."', '".$postData['pwd1']."', '".$postData['creationDate']."', '".$postData['role']."')");		
			$status = 200;
			$data = array('msg' => "Vous avez bien ete enregistre");
			//mail('antoinebouron@gmail.com', 'Mon Sujet', 'Hello!');
			return $response->withJson($data, $status);
		}
	}
});







$app->POST("/forgot-password", function ($request, $response, $conf) use ($app) {
	$postData = $request->getParsedBody();
	$pdo = getPDO($conf);
	$q = $pdo->query("SELECT * FROM account WHERE email = '".$postData['email']."'");
	$r = $q->fetch(PDO::FETCH_ASSOC);
	if (empty($r)) {
		$status = 404;
		$data = "Aucun compte n'est lie a cette adresse";
	} else {
		if (isset($r['waitingForValidation']) && $r['waitingForValidation']) {
			$status = 403;
			$data = "Votre compte est en attente de validation. Il faut attendre encore un peu...";
		} else {
			$status = 200;
			$newPwd = bin2hex(openssl_random_pseudo_bytes(6));
			$pdo->exec("UPDATE account SET password = '".md5(SALT.$newPwd)."' WHERE id = '".$r['id']."'");
			//TO DO => Envoyer le nouveau mot de passe $newPwd par mail et decommenter la ligne ci dessous.
			//$data = "Le nouveau mot de passe vous a ete envoye!";
		}
	}
	return $response->withJson($data, $status);
});

/**
 * Recuperer les infos sur toutes les boxes
 * 401 => l'user ne fourni pas de token valide
 * 200 => user est admin, on retourne le detail des comptes
 */
$app->GET("/getAllBoxes", function ($request, $response, $conf) use ($app) {
	$token = (array) $app->jwt;
	if (isset($token['role']) && $token['role'] != "admin" && $token['role'] != "user") {
		$status = 401;
		$data = "Vous n'êtes pas autorise a faire cette requête.";
	} else {
		$pdo = getPDO($conf);
		$q = $pdo->query("SELECT * FROM boxes");
		$status = 200;
		$data = $q->fetchAll(PDO::FETCH_ASSOC);
	}
	return $response->withJson($data, $status);
});

$app->get("/test", function () use($app) {
    $token = $app->jwt;
    print_r(json_encode($token));
});

/**
 * Recuperer les infos sur toutes les boxes
 * 401 => l'user ne fourni pas de token valide
 * 200 => user est admin, on retourne le detail des comptes
 */
$app->GET("/getAccountInfos", function ($request, $response, $conf) use ($app) {
	$token = (array) $app->jwt;
	if (isset($token['role']) && $token['role'] != "admin" && $token['role'] != "user") {
		$status = 401;
		$data = "Vous n'êtes pas autorise a faire cette requête.";
	} else {
		$pdo = getPDO($conf);
		$q = $pdo->query("SELECT firstname, lastname, email, mainBoxId FROM account WHERE id = '" . $token['userId'] . "'");
		$status = 200;
		$dataUser = $q->fetch(PDO::FETCH_ASSOC);
		if ($dataUser['mainBoxId'] != "0") {
			$q = $pdo->query("SELECT * FROM boxes WHERE id = '" . $dataUser['mainBoxId'] . "'");
			$dataBox = $q->fetch(PDO::FETCH_ASSOC);
			$dataUser['mainBox'] = array('id' => $dataBox['id'], 'name' => $dataBox['name']);;
		}
	}
	return $response->withJson($dataUser, $status);
});

$app->POST("/account/saveParams", function ($request, $response, $conf) use ($app) {
	$postData = $request->getParsedBody();
	$token = (array) $app->jwt;
	$userId = $token['userId'];
	$pdo = getPDO($conf);

	$sql = "UPDATE account SET firstname = '".$postData['firstname']."', lastname='".$postData['lastname']."', email='".$postData['email']."', mainBoxId='".$postData['mainBox']."' WHERE id='".$userId."';";
	$tmt = $pdo->prepare($sql);
	$exe = $tmt->execute();
	if($exe) {
		$status = 200;
		$data = "Vos donnees ont bien ete mises a jour!";
	} else {
		$status = 500;
		$data = "Oops il y a eu un problème!";
	}
	return $response->withJson($data, $status);
});

$app->POST("/editWod/saveConfig", function ($request, $response, $conf) use ($app) {

	$postData = $request->getParsedBody();
	$data = JWT::encode($postData, APIKEY);
	$status = 200;
	return $response->withJson($data, $status);
});






function getPDO($conf) {
	try{
		$host = HOST;
		$dbname = DBNAME;
		$login = DBLOGIN;
		$password = DBPASSWORD;
		$pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $pdo;
	}
	catch(Exception $e){
		return 'Echec de la connexion a la base de donnees';
	}
}

$app->run();