package com.example.fn;

import java.nio.charset.StandardCharsets;

import com.oracle.bmc.Region;
import com.oracle.bmc.auth.AuthenticationDetailsProvider;
import com.oracle.bmc.auth.ConfigFileAuthenticationDetailsProvider;
import com.oracle.bmc.functions.FunctionsInvokeClient;
import com.oracle.bmc.functions.FunctionsManagementClient;
import com.oracle.bmc.functions.model.ApplicationSummary;
import com.oracle.bmc.functions.model.FunctionSummary;
import com.oracle.bmc.functions.requests.InvokeFunctionRequest;
import com.oracle.bmc.functions.requests.ListApplicationsRequest;
import com.oracle.bmc.functions.requests.ListFunctionsRequest;
import com.oracle.bmc.functions.responses.InvokeFunctionResponse;
import com.oracle.bmc.functions.responses.ListApplicationsResponse;
import com.oracle.bmc.functions.responses.ListFunctionsResponse;
import com.oracle.bmc.util.StreamUtils;

import org.apache.commons.io.IOUtils;

public class InvokeFunction {
    final String configurationFilePath = "~/.oci/config";
    final String profile = "KERIS";
    final String compartmentId = "ocid1.compartment.oc1..aaaaaaaamdk52kyjujyhrxuveamnyvku2ta2wvfld4i7ciq5ydo7ktpnkgba";
    final String appName = "mymusictastedw_app";
    final String fnName = "oci-adb-jdbc-java";
    final static Region DEFAULT_REGION = Region.AP_SEOUL_1;

    public static void main(String[] args) {
        try {
            final AuthenticationDetailsProvider provider = new ConfigFileAuthenticationDetailsProvider("~/.oci/config",
                    "KERIS");

            String payload = "{\"channel\": \"server\",\"email\": \"test@example.org\",\"event\": \"health-check\",\"messageId\": \"test-message-myj23m\",\"projectId\": \"hfT8nNSB5l\",\"properties\": {\"property1\": 1,\"property2\": \"test\",\"property3\": true,\"propertyarray\": [{\"key1\": \"value1\",\"key2\": \"value2\"}]},\"replay\": true,\"timestamp\": \"2020-03-06T16:07:32.070Z\",\"type\": \"track\",\"userId\": \"test-user-hg5yje\"}";

            invokeFunction(provider, DEFAULT_REGION,
                    "ocid1.compartment.oc1..aaaaaaaamdk52kyjujyhrxuveamnyvku2ta2wvfld4i7ciq5ydo7ktpnkgba",
                    "mymusictastedw_app", "oci-adb-jdbc-java", payload);

        } catch (

        Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public String handleRequest(String input) {
        String response = "";

        String payload = "{\"channel\": \"server\",\"email\": \"test@example.org\",\"event\": \"health-check\",\"messageId\": \"test-message-myj23m\",\"projectId\": \"hfT8nNSB5l\",\"properties\": {\"property1\": 1,\"property2\": \"test\",\"property3\": true,\"propertyarray\": [{\"key1\": \"value1\",\"key2\": \"value2\"}]},\"replay\": true,\"timestamp\": \"2020-03-06T16:07:32.070Z\",\"type\": \"track\",\"userId\": \"test-user-hg5yje\"}";

        try {
            final AuthenticationDetailsProvider provider = new ConfigFileAuthenticationDetailsProvider(
                    configurationFilePath, profile);

            response = invokeFunction(provider, DEFAULT_REGION, compartmentId, appName, fnName, payload);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return response;
    }

    public static String invokeFunction(final AuthenticationDetailsProvider provider, final Region region,
            final String compartmentId, String appName, String fnName, String payload) throws Exception {

        String response;
        final FunctionsManagementClient fnManagementClient = new FunctionsManagementClient(provider);
        fnManagementClient.setRegion(region);

        final FunctionsInvokeClient fnInvokeClient = new FunctionsInvokeClient(provider);

        try {
            // Invoke the function!
            final FunctionSummary fn = getUniqueFunctionByName(fnManagementClient, compartmentId, appName, fnName);

            // Configure the client to use the assigned function endpoint.
            fnInvokeClient.setEndpoint(fn.getInvokeEndpoint());
            final InvokeFunctionRequest invokeFunctionRequest = InvokeFunctionRequest.builder().functionId(fn.getId())
                    .invokeFunctionBody(StreamUtils.createByteArrayInputStream(payload.getBytes())).build();

            // Invoke the function!
            final InvokeFunctionResponse invokeFunctionResponse = fnInvokeClient.invokeFunction(invokeFunctionRequest);

            // Handle the response.
            response = IOUtils.toString(invokeFunctionResponse.getInputStream(), StandardCharsets.UTF_8);

            if (response == null) {
                throw new Exception("response is null!!");
            }

            return response;
        } catch (final Exception e) {
            e.printStackTrace();
            System.err.println("Failed to invoke function: " + e);
            throw e;
        } finally {
            fnInvokeClient.close();
            fnManagementClient.close();
        }
    }

    public static FunctionSummary getUniqueFunctionByName(final FunctionsManagementClient fnManagementClient,
            final String compartmentId, final String applicationDisplayName, final String functionDisplayName)
            throws Exception {
        final ApplicationSummary application = getUniqueApplicationByName(fnManagementClient, compartmentId,
                applicationDisplayName);
        return getUniqueFunctionByName(fnManagementClient, application.getId(), functionDisplayName);
    }

    public static FunctionSummary getUniqueFunctionByName(final FunctionsManagementClient fnManagementClient,
            final String applicationId, final String functionDisplayName) throws Exception {

        final ListFunctionsRequest listFunctionsRequest = ListFunctionsRequest.builder().applicationId(applicationId)
                .displayName(functionDisplayName).build();

        final ListFunctionsResponse listFunctionsResponse = fnManagementClient.listFunctions(listFunctionsRequest);

        if (listFunctionsResponse.getItems().size() != 1) {
            throw new Exception(
                    "Could not find function with name " + functionDisplayName + " in application " + applicationId);
        }

        return listFunctionsResponse.getItems().get(0);
    }

    public static ApplicationSummary getUniqueApplicationByName(final FunctionsManagementClient fnManagementClient,
            final String compartmentId, final String applicationDisplayName) throws Exception {

        // Find the application in a specific compartment
        final ListApplicationsRequest listApplicationsRequest = ListApplicationsRequest.builder()
                .displayName(applicationDisplayName).compartmentId(compartmentId).build();

        final ListApplicationsResponse resp = fnManagementClient.listApplications(listApplicationsRequest);

        if (resp.getItems().size() != 1) {
            throw new Exception("Could not find unique application with name " + applicationDisplayName
                    + " in compartment " + compartmentId);
        }

        final ApplicationSummary application = resp.getItems().get(0);
        return application;
    }
}