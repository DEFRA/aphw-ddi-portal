Feature: Create new CDO

    Scenario: Enter new owner details
        Given I open the url "/"
        When I click on the link containing "Process new CDO or"
        And I set "John" to the inputfield "#firstName"
        And I set "Smith" to the inputfield "#lastName"
        And I click on the element "button=Continue"
        Then I expect that element "h1" contains the text "What is the owner's postcode?"

    Scenario: Enter address
        When I set "LS20 8DA" to the inputfield "#postcode"
        And I set "12" to the inputfield "#houseNumber"
        And I click on the element "button=Continue"
        Then I expect that element "form" contains the text "12 INGS LANE"

    Scenario: Confirm address
        When I click on the element "button=Confirm address"
        Then I expect that container "h1" contains the text "What is the microchip number?"

    Scenario: Enter microchip number
        When I set "345677654312333" to the inputfield "#microchipNumber"
        And I click on the element "button=Continue"
        Then I expect that container "h1" contains the text "Add dog details"

    Scenario: Enter dog details
        When I select the radio option with the value "XL Bully" from the radio group "breed"
        And I set "Fido" to the inputfield "#name"
        And I select the radio option with the value "cdo" from the radio group "applicationType"
        And I set "01" to the inputfield "#cdoIssued-day"
        And I set "02" to the inputfield "#cdoIssued-month"
        And I set "2024" to the inputfield "#cdoIssued-year"
        And I click on the element "button=Add dog details"
        Then I expect that element "h1" contains the text "Confirm dog details"
        And I expect that element "(//dd)[1]" contains the text "XL Bully"
        And I expect that element "(//dd)[2]" contains the text "Fido"
        And I expect that element "(//dd)[3]" contains the text "345677654312333"
        And I expect that element "(//dd)[4]" contains the text "01 February 2024"
        And I expect that element "(//dd)[5]" contains the text "01 April 2024"    

    Scenario: Confirm dog details
        When I click on the element "button=Confirm details"
        Then I expect that element "h1" contains the text "Enter police and court details"

    Scenario: Enter enforcement details and Confirm all details
        When I set "Northampton (Northampton Crown Court)" to the inputfield "#court"
        And I click on the element "#legislationOfficer"
        And I click on the element "button=Continue"
        Then I expect that element "h1" contains the text "Confirm all details"
        And I expect that element "(//dd)[1]" contains the text "John Smith"
        And I expect that element "(//dd)[3]" not contains any text
        And I expect that element "(//dd)[5]" contains the text "LS20 8DA"
        And I expect that element "(//dd)[7]" contains the text "England"
        And I expect that element "(//dd)[8]" contains the text "West Yorkshire Police"
        And I expect that element "(//dd)[9]" not contains any text
        And I expect that element "(//dd)[10]" contains the text "Northampton (Northampton Crown Court)"
        And I expect that element "(//dd)[11]" contains the text "XL Bully"
        And I expect that element "(//dd)[12]" contains the text "Fido"
        And I expect that element "(//dd)[13]" contains the text "345677654312333"
        And I expect that element "(//dd)[14]" contains the text "01 February 2024"
        And I expect that element "(//dd)[15]" contains the text "01 April 2024"

    Scenario: CDO record created successfully
        When I click on the element "button=Confirm details"
        Then I expect that element "h1" contains the text "Record created" 
        And I expect that element "(//dd)[1]" contains the text "XL Bully"
        And I expect that element "(//dd)[2]" contains the text "Fido"
        And I expect that element "(//dd)[3]" contains the text "345677654312333"
        And I expect that element "(//dd)[4]" contains the text "01 February 2024"
        And I expect that element "(//dd)[5]" contains the text "01 April 2024"
        And I expect that element "(//dd)[6]" contains the text "John Smith"
        And I expect that element "(//dd)[7]" contains the text "LS20 8DA"
        And I expect that element "(//dd)[8]" contains the text "England"
        And I expect that element "(//dd)[9]" contains the text "Northampton (Northampton Crown Court)"  
        And I expect that element "(//dd)[10]" contains the text "West Yorkshire Police"         