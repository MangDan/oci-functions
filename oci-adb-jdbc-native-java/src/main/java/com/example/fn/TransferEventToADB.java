package com.example.fn;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.oracle.bmc.Region;
import com.oracle.bmc.auth.ResourcePrincipalAuthenticationDetailsProvider;
import com.oracle.bmc.objectstorage.ObjectStorage;
import com.oracle.bmc.objectstorage.ObjectStorageClient;
import com.oracle.bmc.objectstorage.requests.GetObjectRequest;
import com.oracle.bmc.objectstorage.requests.ListObjectsRequest;
import com.oracle.bmc.objectstorage.responses.GetObjectResponse;
import com.oracle.bmc.objectstorage.responses.ListObjectsResponse;

import org.apache.commons.io.FileUtils;

import oracle.ucp.jdbc.PoolDataSource;
import oracle.ucp.jdbc.PoolDataSourceFactory;

public class TransferEventToADB {

    private final PoolDataSource poolDataSource;

    private final File walletDir = new File("/tmp", "wallet");
    private final String namespace = System.getenv().get("NAMESPACE");
    private final String bucketName = System.getenv().get("BUCKET_NAME");
    private final String dbUser = System.getenv().get("DB_USER");
    private final String dbPassword = System.getenv().get("DB_PASSWORD");
    private final String dbUrl = System.getenv().get("DB_URL");

    final static String CONN_FACTORY_CLASS_NAME = "oracle.jdbc.pool.OracleDataSource";

    public TransferEventToADB() {
        System.out.println("Setting up pool data source");
        poolDataSource = PoolDataSourceFactory.getPoolDataSource();
        try {
            poolDataSource.setConnectionFactoryClassName(CONN_FACTORY_CLASS_NAME);
            poolDataSource.setURL(dbUrl);
            poolDataSource.setUser(dbUser);
            poolDataSource.setPassword(dbPassword);
            poolDataSource.setConnectionPoolName("UCP_POOL");
        } catch (final SQLException e) {
            System.out.println("Pool data source error!");
            e.printStackTrace();
        }
        System.out.println("Pool data source setup...");
    }

    public String handleRequest(final Event event) {
        System.setProperty("oracle.jdbc.fanEnabled", "false");

        String resultMsg = "";
        PreparedStatement st = null;
        Connection conn = null;

        try {
            if (needWalletDownload()) {
                System.out.println("Start wallet download...");
                downloadWallet();
                System.out.println("End wallet download!");
            }

            // Statement statement = conn.createStatement();
            // ResultSet resultSet = statement.executeQuery("select * from t_user");
            // List<HashMap<String, Object>> recordList = convertResultSetToList(resultSet);
            // System.out.println(new ObjectMapper().writeValueAsString(recordList));

            conn = poolDataSource.getConnection();
            conn.setAutoCommit(false);

            st = conn.prepareStatement("INSERT INTO EVENT VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

            st.setString(1, event.channel);
            st.setString(2, event.email);
            st.setString(3, event.event);
            st.setString(4, event.messageId);
            st.setString(5, event.projectId);
            st.setString(6, Boolean.toString(event.replay));
            st.setString(7, event.timestamp);
            st.setString(8, event.type);
            st.setString(9, event.userId);
            // execute the preparedstatement insert
            st.executeUpdate();
            st.close();

            st = conn.prepareStatement("INSERT INTO PROPERTIES VALUES (?, ?, ?)");
            st.setInt(1, event.properties.property1);
            st.setString(2, event.properties.property2);
            st.setString(3, Boolean.toString(event.properties.property3));
            // execute the preparedstatement insert
            st.executeUpdate();
            st.close();

            st = conn.prepareStatement("INSERT INTO PROPERTYARRAY VALUES (?, ?)");
            if (event.getProperties().propertyarray.size() > 0) {
                for (int i = 0; i < event.getProperties().propertyarray.size(); i++) {
                    st.setString(1, event.getProperties().propertyarray.get(i).get("key1"));
                    st.setString(2, event.getProperties().propertyarray.get(i).get("key2"));
                    st.executeUpdate();
                }
            }

            System.out.println("***");

        } catch (Exception e) {
            resultMsg = e.getMessage();
        } finally {
            try {
                conn.commit();
                conn.close();
                resultMsg = "success";
            } catch (final SQLException e) {
                resultMsg = e.getMessage();
            }
        }

        // statement.executeUpdate("INSERT INTO T_USER " + "VALUES (1, 'TEST...')");

        return resultMsg;
    }

    private List<HashMap<String, Object>> convertResultSetToList(final ResultSet rs) throws SQLException {
        final ResultSetMetaData md = rs.getMetaData();
        final int columns = md.getColumnCount();
        final List<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();
        while (rs.next()) {
            final HashMap<String, Object> row = new HashMap<String, Object>(columns);
            for (int i = 1; i <= columns; ++i) {
                row.put(md.getColumnName(i), rs.getObject(i));
            }
            list.add(row);
        }
        return list;
    }

    private Boolean needWalletDownload() {
        boolean result = false;

        if (walletDir.isDirectory() || walletDir.exists()) {
            final File[] fList = walletDir.listFiles();
            for (int i = 0; i < fList.length; i++)
                System.out.println(fList[i].getName());

            if (fList.length > 0) {
                System.out.println("Wallet exists, don't download it again...");
                result = false;
            } else {
                System.out.println("Didn't find wallet files, let's download files...");
                result = true;
            }
        } else {
            walletDir.mkdirs();
            result = true;
        }

        return result;
    }

    private void downloadWallet() {

        // Use Resource Principal
        final ResourcePrincipalAuthenticationDetailsProvider provider = ResourcePrincipalAuthenticationDetailsProvider
                .builder().build();

        final ObjectStorage client = new ObjectStorageClient(provider);
        client.setRegion(Region.AP_SEOUL_1);

        System.out.println("Retrieving a list of all objects in /" + namespace + "/" + bucketName + "...");
        // List all objects in wallet bucket
        final ListObjectsRequest listObjectsRequest = ListObjectsRequest.builder().namespaceName(namespace)
                .bucketName(bucketName).build();
        final ListObjectsResponse listObjectsResponse = client.listObjects(listObjectsRequest);
        System.out.println("List retrieved. Starting download of each object...");

        // Iterate over each wallet file, downloading it to the Function's Docker
        // container
        listObjectsResponse.getListObjects().getObjects().stream().forEach(objectSummary -> {
            System.out.println("Downloading wallet file: [" + objectSummary.getName() + "]");

            final GetObjectRequest objectRequest = GetObjectRequest.builder().namespaceName(namespace)
                    .bucketName(bucketName).objectName(objectSummary.getName()).build();
            final GetObjectResponse objectResponse = client.getObject(objectRequest);

            try {
                final File f = new File(walletDir + "/" + objectSummary.getName());
                FileUtils.copyToFile(objectResponse.getInputStream(), f);
                System.out.println("Stored wallet file: " + f.getAbsolutePath());
            } catch (final IOException e) {
                e.printStackTrace();
            }
        });
    }

    public static class ArrayProperties {
        private Map<String, String> property;

        public Map<String, String> getProperty() {
            return property;
        }

        public void setProperty(final Map<String, String> property) {
            this.property = property;
        }
    }

    public static class Property {
        private int property1; // id
        private String property2; // name
        private boolean property3; // temp
        private ArrayList<Map<String, String>> propertyarray;

        public int getProperty1() {
            return property1;
        }

        public ArrayList<Map<String, String>> getPropertyarray() {
            return propertyarray;
        }

        public void setPropertyarray(ArrayList<Map<String, String>> propertyarray) {
            this.propertyarray = propertyarray;
        }

        public boolean isProperty3() {
            return property3;
        }

        public void setProperty3(final boolean property3) {
            this.property3 = property3;
        }

        public String getProperty2() {
            return property2;
        }

        public void setProperty2(final String property2) {
            this.property2 = property2;
        }

        public void setProperty1(final int property1) {
            this.property1 = property1;
        }

    }

    public static class Event {
        private String channel;
        private String email;
        private String event;
        private String messageId;
        private String projectId;
        private String timestamp;
        private Property properties;
        private boolean replay;
        private String type;
        private String userId;

        public String getType() {
            return type;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(final String userId) {
            this.userId = userId;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(final String timestamp) {
            this.timestamp = timestamp;
        }

        public String getProjectId() {
            return projectId;
        }

        public void setProjectId(final String projectId) {
            this.projectId = projectId;
        }

        public String getMessageId() {
            return messageId;
        }

        public void setMessageId(final String messageId) {
            this.messageId = messageId;
        }

        public String getEvent() {
            return event;
        }

        public void setEvent(final String event) {
            this.event = event;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(final String email) {
            this.email = email;
        }

        public boolean isReplay() {
            return replay;
        }

        public void setReplay(final boolean replay) {
            this.replay = replay;
        }

        public String getChannel() {
            return channel;
        }

        public void setChannel(final String channel) {
            this.channel = channel;
        }

        public Property getProperties() {
            return properties;
        }

        public void setProperties(final Property properties) {
            this.properties = properties;
        }

        public void setType(final String type) {
            this.type = type;
        }

    }

}