import xml.dom.minidom

class SAPEvent(object):
    Event            = '~E001'
    Section_Begin    = '~E002'
    Section_End      = '~E003'
    Keyvalue         = '~E004'
    Keyvalue_Pair    = '~E005'
    Collection_Entry = '~E006'

    def __init__(self, content):
        print("[SAPEvent] [init] {}".format(content))
        self.raw_message = self._parse_content(content)
        
        return
    
    def get_pretty_message(self):
        print("[SAPEvent] [get_pretty_message] {}".format(self.raw_message))

        xml_dom = xml.dom.minidom.parseString(self.raw_message)
        return xml_dom.toprettyxml(indent='\t')

    def _parse_content(self, content):
        print("[SAPEvent] [_parse_content] {}".format(content))

        #FIXME: better serialized parsing
        output = '<sapeventqueue>'
        # split SAPEvent.Event
        events = content.split(SAPEvent.Event)
        for event in events:
            # Split Sections and remove Section_End
            sections = event.replace(SAPEvent.Section_End,"").split(SAPEvent.Section_Begin)
            
            # Create event
            output += '<event name="{}">'.format(sections[0])
            for x in sections[1:]:
                output += '<section>'
                kv = list()
                for r in x.split(SAPEvent.Keyvalue_Pair):
                    kvx = r.split(SAPEvent.Keyvalue)
                    print("[SAPEvent] [_parse_content] {}".format(kvx))
                    if len(kvx) == 2:
                        output += '<keyvalue>'
                        output += '<key>{}</key>'.format(kvx[0])
                        output += '<value>{}</value>'.format(kvx[1])
                        output += '</keyvalue>'

                    r = r.replace(SAPEvent.Keyvalue,"=")
                    kv.append(r)

                # Concatenate KeyValue pairs
                #output += "&".join(kv)
                # Terminate section
                output += '</section>'
            
            output += "</event>\r\n"
        output += "</sapeventqueue>"

        return output

# # ESSA LINHA FUNCIONA
# text = "SAPEVENTQUEUE=SapTable_ClientRowSelect~E002Id~E004WD0134~E005RowIndex~E0041~E005RowUserData~E004~E005CellUserData~E004~E005AccessType~E004STANDARD~E005TriggerCellId~E004WD019F~E003~E002ResponseData~E004delta~E003~E002~E003~E001Link_Activate~E002Id~E004WD01A0~E005Ctrl~E004false~E005Shift~E004false~E003~E002ResponseData~E004delta~E005ClientAction~E004submit~E003~E002~E003"

# text = "SAPEVENTQUEUE=SapTable_ClientRowSelect~E002~E005RowIndex~E0041~E005RowUserData~E004~E005CellUserData~E004~E005AccessType~E004STANDARD~E003~E002ResponseData~E004delta~E003~E002~E003"

# text = "SapTable_ClientRowSelect~E002Id~E004WD0134~E005RowIndex~E0041~E005RowUserData~E004~E005CellUserData~E004~E005AccessType~E004STANDARD~E005TriggerCellId~E004WD019F~E003~E002ResponseData~E004delta~E003~E002~E003~E001Link_Activate~E002Id~E004WD01A0~E005Ctrl~E004false~E005Shift~E004false~E003~E002ResponseData~E004delta~E005ClientAction~E004submit~E003~E002~E003"
# sap = SAPEvent(text)
# p = sap.get_pretty_message()

# print(p)


# 16.03.2022

import time
data_atual = time.strftime("%d.%m.%Y")
print(data_atual)