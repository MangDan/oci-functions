var service = 
  {
    amazon : { 'us-phoenix-1' : '<object_storage_namespace>.compat.us-phoenix-1.oraclecloud.com',
               'us-ashburn-1' : '<object_storage_namespace>.compat.us-ashburn-1.oraclecloud.com',
               'eu-frankfurt-1' : '<object_storage_namespace>.compat.eu-frankfurt-1.oraclecloud.com',
               'uk-london-1' : '<object_storage_namespace>.compat.uk-london-1.oraclecloud.com' },
    myServices : 'itra.oraclecloud.com',
    kms : { 'us-phoenix-1' : 'kms.us-phoenix-1.oraclecloud.com',
              'us-ashburn-1' : 'kms.us-ashburn-1.oraclecloud.com',
              'eu-frankfurt-1' : 'kms.eu-frankfurt-1.oraclecloud.com',
              'uk-london-1' : 'kms.uk-london-1.oraclecloud.com' } ,
    audit : { 'us-phoenix-1' : 'audit.us-phoenix-1.oraclecloud.com',
              'us-ashburn-1' : 'audit.us-ashburn-1.oraclecloud.com',
              'eu-frankfurt-1' : 'audit.eu-frankfurt-1.oraclecloud.com',
              'uk-london-1' : 'audit.uk-london-1.oraclecloud.com' } ,
    containerEngine : { 'us-phoenix-1' : 'containerEngine.us-phoenix-1.oraclecloud.com',
                        'us-ashburn-1' : 'containerEngine.us-ashburn-1.oraclecloud.com',
                        'eu-frankfurt-1' : 'containerEngine.eu-frankfurt-1.oraclecloud.com',
                        'uk-london-1' : 'containerEngine.uk-london-1.oraclecloud.com' } ,
    database : { 'us-phoenix-1' : 'database.us-phoenix-1.oraclecloud.com',
                 'us-ashburn-1' : 'database.us-ashburn-1.oraclecloud.com',
                 'eu-frankfurt-1' : 'database.eu-frankfurt-1.oraclecloud.com',
                 'uk-london-1' : 'database.uk-london-1.oraclecloud.com' } ,
    iam : { 'us-phoenix-1' : 'identity.us-phoenix-1.oraclecloud.com',
            'us-ashburn-1' : 'identity.us-ashburn-1.oraclecloud.com',
            'eu-frankfurt-1' : 'identity.eu-frankfurt-1.oraclecloud.com',
            'uk-london-1' : 'identity.uk-london-1.oraclecloud.com' } ,
    loadBalance : { 'us-phoenix-1' : 'iaas.us-phoenix-1.oraclecloud.com',
                    'us-ashburn-1' : 'iaas.us-ashburn-1.oraclecloud.com',
                    'eu-frankfurt-1' : 'iaas.eu-frankfurt-1.oraclecloud.com',
                    'uk-london-1' : 'iaas.uk-london-1.oraclecloud.com' } ,
    core : { 'ap-seoul-1' : 'iaas.ap-seoul-1.oraclecloud.com',
             'ap-chuncheon-1' : 'iaas.ap-chuncheon-1.oraclecloud.com',
             'us-phoenix-1' : 'iaas.us-phoenix-1.oraclecloud.com',
             'us-ashburn-1' : 'iaas.us-ashburn-1.oraclecloud.com',
             'eu-frankfurt-1' : 'iaas.eu-frankfurt-1.oraclecloud.com',
             'uk-london-1' : 'iaas.uk-london-1.oraclecloud.com' } ,
    email : { 'us-phoenix-1' : 'email.us-phoenix-1.oraclecloud.com',
              'us-ashburn-1' : 'email.us-ashburn-1.oraclecloud.com',
              'eu-frankfurt-1' : 'email.eu-frankfurt-1.oraclecloud.com',
              'uk-london-1' : 'email.uk-london-1.oraclecloud.com' } ,
    dns : { 'us-phoenix-1' : 'dns.us-phoenix-1.oraclecloud.com',
            'us-ashburn-1' : 'dns.us-ashburn-1.oraclecloud.com',
            'eu-frankfurt-1' : 'dns.eu-frankfurt-1.oraclecloud.com',
            'uk-london-1' : 'dns.uk-london-1.oraclecloud.com' } ,
    fileStorage : { 'us-phoenix-1' : 'filestorage.us-phoenix-1.oraclecloud.com',
                    'us-ashburn-1' : 'filestorage.us-ashburn-1.oraclecloud.com',
                    'eu-frankfurt-1' : 'filestorage.eu-frankfurt-1.oraclecloud.com',
                    'uk-london-1' : 'filestorage.uk-london-1.oraclecloud.com' } ,
    internetIntel : { 'us-phoenix-1' : 'cloudanalytics.us-phoenix-1.oraclecloud.com',
                      'us-ashburn-1' : 'cloudanalytics.us-ashburn-1.oraclecloud.com',
                      'eu-frankfurt-1' : 'cloudanalytics.eu-frankfurt-1.oraclecloud.com',
                      'uk-london-1' : 'cloudanalytics.uk-london-1.oraclecloud.com' } ,
    search : { 'us-phoenix-1' : 'query.us-phoenix-1.oraclecloud.com',
               'us-ashburn-1' : 'query.us-ashburn-1.oraclecloud.com',
               'eu-frankfurt-1' : 'query.eu-frankfurt-1.oraclecloud.com',
               'uk-london-1' : 'query.uk-london-1.oraclecloud.com' } ,
    myService : { 'us-phoenix-1' : 'itra.oraclecloud.com/',
                  'us-ashburn-1' : 'itra.oraclecloud.com/',
                  'eu-frankfurt-1' : 'itra.oraclecloud.com/',
                  'uk-london-1' : 'tra.oraclecloud.com/' },
    objectStore : { 'ap-chuncheon-1' : 'objectstorage.ap-chuncheon-1.oraclecloud.com',
                    'ap-seoul-1' : 'objectstorage.ap-seoul-1.oraclecloud.com',
                    'us-phoenix-1' : 'objectstorage.us-phoenix-1.oraclecloud.com',
                    'us-ashburn-1' : 'objectstorage.us-ashburn-1.oraclecloud.com',
                    'eu-frankfurt-1' : 'objectstorage.eu-frankfurt-1.oraclecloud.com',
                    'uk-london-1' : 'objectstorage.uk-london-1.oraclecloud.com' },
    notifications : { 'ap-chuncheon-1' : 'notification.ap-chuncheon-1.oraclecloud.com',
                      'ap-seoul-1' : 'notification.ap-seoul-1.oraclecloud.com',
                      'us-ashburn-1' : 'notification.us-ashburn-1.oraclecloud.com'},
    usage : { 'ap-chuncheon-1' : 'usageapi.ap-chuncheon-1.oci.oraclecloud.com',
                      'ap-seoul-1' : 'usageapi.ap-seoul-1.oci.oraclecloud.com',
                      'us-ashburn-1' : 'usageapi.us-ashburn-1.oci.oraclecloud.com'}
  };

module.exports = {
    service: service
};
