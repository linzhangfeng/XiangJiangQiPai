#include "common.h"
#include "stdarg.h"
#include "unistd.h"
#include "cryptopp/rsa.h"
#include "cryptopp/hex.h"
#include "cryptopp/integer.h"
#include "cryptopp/files.h"
#include "cryptopp/osrng.h"
#include <cryptopp/base64.h>
#include <random>

using namespace std;
using namespace CryptoPP;

std::string string_format(const std::string fmt, ...)
{
	int size = ((int)fmt.size()) * 2 + 50;   // Use a rubric appropriate for your code
	std::string str;
	va_list ap;
	while (1)
	{     // Maximum two passes on a POSIX system...
		str.resize(size);
		va_start(ap, fmt);
		int n = vsnprintf((char *)str.data(), size, fmt.c_str(), ap);
		va_end(ap);
		if (n > -1 && n < size)
		{  // Everything worked
			str.resize(n);
			return str;
		}
		if (n > -1)  // Needed size returned
			size = n + 1;   // For null char
		else
			size *= 2;      // Guess at a larger size (OS specific)
	}
	return str;
}

uint32_t get_id()
{
	static uint32_t g_id = 0;
	return g_id++;
}

uint32_t GetRomoid()
{
	static uint32_t roomid = 10000;
	return roomid++;
}

int GetRandom(int min, int max)
{
	std::random_device r;
	std::default_random_engine e1(r());
	std::uniform_int_distribution<int> uniform_dist(min, max);
	return uniform_dist(e1);
}


std::string RSASign(std::string message)
{
	FileSource file_pri("./conf/privkey.p8", true);


	RSA::PrivateKey privateKey;
	privateKey.Load(file_pri);

	CryptoPP::AutoSeededRandomPool rng;

	string signature;

	RSASSA_PKCS1v15_SHA_Signer signer(privateKey);

	StringSource ss1(message, true,
		new SignerFilter(rng, signer,
			new Base64Encoder(
				new StringSink(signature) , false
			)
		) // SignerFilter
	); // StringSource

	return signature;
}

