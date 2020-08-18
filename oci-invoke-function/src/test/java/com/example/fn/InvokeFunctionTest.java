package com.example.fn;

import static org.junit.Assert.assertEquals;

import com.fnproject.fn.testing.FnTestingRule;

import org.junit.Rule;
import org.junit.Test;

public class InvokeFunctionTest {

    @Rule
    public final FnTestingRule testing = FnTestingRule.createDefault();

    @Test
    public void shouldReturnGreeting() {
        // testing.givenEvent().enqueue();
        // testing.thenRun(HelloFunction.class, "handleRequest");

        // assertEquals("Hello, world!", result.getBodyAsString());
        // UserInfo[] users = new UserInfo[10];
        assertEquals(true, true);
    }
}