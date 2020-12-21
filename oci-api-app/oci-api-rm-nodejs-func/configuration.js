// apackrsct01
var configs = {
    apackrsct01 : {
            tenancyId: 'ocid1.tenancy.oc1..aaaaaaaa6ma7kq3bsif76uzqidv22cajs3fpesgpqmmsgxihlbcemkklrsqa',
            userId: 'ocid1.user.oc1..aaaaaaaalpieyqquaaneneuyiifrtfbzwcr3hqd7tqfoobwq7xr4jv5pfz3a',
            keyFingerprint: 'f6:ca:da:c0:ed:9f:27:13:2c:9c:a0:91:8e:7b:92:ca',
            //compartmentId: 'ocid1.compartment.oc1..aaaaaaaa2ps2cj6joosvscmkvmwtfabassubsiku6qf3yoy3hkchofmzdytq',
            //region: 'ap-seoul-1',
            region: 'ap-seoul-1',
            RESTversion: '/20171215', //20160918
            privateKeyFile: 'oci_api_key.pem',
            passphrase: '',
            papertrail: {
                host: 'logs2.papertrailapp.com',
                port: 27700
            },
            cloudAccountAdmin: 'jinho.jang@oracle.com',
            cloudAccountAdminPw: 'WelcomeGambas1234!'
        }
}


var bucket_configs = {
    bucketName: 'test',
    namespaceName: 'apackrsct01'
}

module.exports = {
    configs: configs,
    bucket_configs: bucket_configs
};