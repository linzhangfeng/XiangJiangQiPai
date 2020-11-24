#include "protobuf2json.h"

#include <jsoncpp/json/json.h>
#include <iostream>
using namespace std;



void ParseMessage(const google::protobuf::Message& msg,const google::protobuf::Descriptor *pdescriptor, const google::protobuf::Reflection *preflection , Json::Value& root)
{
	for ( int i = 0 ; i < pdescriptor->field_count() ; ++i  )
	{
		const google::protobuf::FieldDescriptor* pfielddesc = pdescriptor->field(i);

		if ( pfielddesc->is_optional() &&  !preflection->HasField(msg, pfielddesc))
		{
			continue;;
		}
		if ( !pfielddesc )
		{
			return;
		}
		string str_name = pfielddesc->name();
		switch (pfielddesc->cpp_type())
		{
		case google::protobuf::FieldDescriptor::CPPTYPE_INT32:
		{
			if ( pfielddesc->label() == google::protobuf::FieldDescriptor::LABEL_REPEATED)
			{
				int length = preflection->FieldSize(msg, pfielddesc);
				for ( int j = 0 ; j < length ; ++j )
				{
					root[str_name].append(preflection->GetRepeatedInt32(msg, pfielddesc, j));
				}
			}
			else
			{
				root[str_name] = preflection->GetInt32(msg, pfielddesc);
			}			
			break;
		}
		case google::protobuf::FieldDescriptor::CPPTYPE_STRING:
		{
			if (pfielddesc->label() == google::protobuf::FieldDescriptor::LABEL_REPEATED)
			{
				int length = preflection->FieldSize(msg, pfielddesc);
				for (int j = 0; j < length; ++j)
				{
					root[str_name].append(preflection->GetRepeatedString(msg, pfielddesc, j));
				}
			}
			else
			{
				root[str_name] = preflection->GetString(msg, pfielddesc);
			}
			break;
		}
		case google::protobuf::FieldDescriptor::CPPTYPE_DOUBLE:
		{
			if (pfielddesc->label() == google::protobuf::FieldDescriptor::LABEL_REPEATED)
			{
				int length = preflection->FieldSize(msg, pfielddesc);
				for (int j = 0; j < length; ++j)
				{
					root[str_name].append(preflection->GetRepeatedDouble(msg, pfielddesc, j));
				}
			}
			else
			{
				root[str_name] = preflection->GetDouble(msg, pfielddesc);
			}
			break;
		}
		case google::protobuf::FieldDescriptor::CPPTYPE_BOOL:
		{
			if (pfielddesc->label() == google::protobuf::FieldDescriptor::LABEL_REPEATED)
			{
				int length = preflection->FieldSize(msg, pfielddesc);
				for (int j = 0; j < length; ++j)
				{
					root[str_name].append(preflection->GetRepeatedBool(msg, pfielddesc, j));
				}
			}
			else
			{
				root[str_name] = preflection->GetBool(msg, pfielddesc);
			}
			break;
		}
		case google::protobuf::FieldDescriptor::CPPTYPE_FLOAT:
		{
			if (pfielddesc->label() == google::protobuf::FieldDescriptor::LABEL_REPEATED)
			{
				int length = preflection->FieldSize(msg, pfielddesc);
				for (int j = 0; j < length; ++j)
				{
					root[str_name].append(preflection->GetRepeatedFloat(msg, pfielddesc, j));
				}
			}
			else
			{
				root[str_name] = preflection->GetFloat(msg, pfielddesc);
			}
			break;
		}
		case google::protobuf::FieldDescriptor::CPPTYPE_MESSAGE:
		{
			if (pfielddesc->label() == google::protobuf::FieldDescriptor::LABEL_REPEATED)
			{
				for ( int j= 0 ; j < preflection->FieldSize(msg , pfielddesc) ; ++j )
				{
					const google::protobuf::Message &sub_msg = preflection->GetRepeatedMessage(msg, pfielddesc , j);
					const google::protobuf::Descriptor *pdescriptor = sub_msg.GetDescriptor();
					const google::protobuf::Reflection *preflection = sub_msg.GetReflection();
					if (pdescriptor && preflection)
					{
						Json::Value sub_val;
						ParseMessage(sub_msg, pdescriptor, preflection, sub_val);
						root[str_name].append(sub_val);
					}
				}
			}
			else
			{
				const google::protobuf::Message &sub_msg = preflection->GetMessage(msg, pfielddesc);
				const google::protobuf::Descriptor *pdescriptor = sub_msg.GetDescriptor();
				const google::protobuf::Reflection *preflection = sub_msg.GetReflection();
				if (pdescriptor && preflection)
				{
					ParseMessage(sub_msg, pdescriptor, preflection, root[str_name]);
				}
			}			
			break;
		}
		default:
			break;
		}
	}
}


string Protobuf2Json(const google::protobuf::Message& msg)
{
	Json::Value root;

	const google::protobuf::Descriptor *pdescriptor = msg.GetDescriptor();
	const google::protobuf::Reflection *preflection = msg.GetReflection();
	
	string str_name = pdescriptor->name();
	if ( pdescriptor && preflection )
	{
		ParseMessage(msg , pdescriptor, preflection , root[str_name]);
	}
	return root.toStyledString();
}

