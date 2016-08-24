package com.hc.test;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;


public class TestDemoJson {
	

	public  static  void  main(String[] ae){
		String fullFileName = "json/provinces.json";

    	File file = new File(fullFileName);
    	Scanner scanner = null;
    	StringBuilder buffer = new StringBuilder();
    	try {
    	    scanner = new Scanner(file, "utf-8");
    	    while (scanner.hasNextLine()) {
    	        buffer.append(scanner.nextLine());
    	    }

    	} catch (FileNotFoundException e) {
    	    // TODO Auto-generated catch block  

    	} finally {
    	    if (scanner != null) {
    	        scanner.close();
    	    }
    	}
    	 
    	System.out.println(buffer.toString());
	}
}


